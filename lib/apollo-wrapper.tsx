'use client'

import { HttpLink, from, useApolloClient } from '@apollo/client'
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache
} from '@apollo/experimental-nextjs-app-support/ssr'
import { useSession } from 'next-auth/react'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { setContext } from '@apollo/client/link/context'
import errorLink from './errorLink'

function makeClient() {
  const authLink = setContext(async (_, { headers, token }) => {
    return {
      headers: {
        ...headers,
        ...(token ? { authorization: `Bearer ${token}` } : {})
      }
    }
  })

  const httpLink = new HttpLink({
    uri: process.env.GRAPHQL_ENDPOINT,
    fetch
  })

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    defaultOptions: {
      query: {
        errorPolicy: 'all'
      },
      mutate: {
        errorPolicy: 'all'
      }
    },
    link: authLink.concat(from([errorLink, httpLink]))
  })
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const session = useSession()

  console.log({ session })

  return (
    <>
      {session.status === 'loading' && <></>}

      {session.status !== 'loading' && (
        <ApolloNextAppProvider makeClient={() => makeClient()}>
          <UpdateAuth>{children}</UpdateAuth>
        </ApolloNextAppProvider>
      )}
    </>
  )
}

function UpdateAuth({ children }: { children: ReactNode }) {
  const session = useSession()
  const apolloClient = useApolloClient()

  useEffect(() => {
    if (session.data?.token.jwt) {
      apolloClient.defaultContext.token = session.data.token.jwt
    }
  }, [session.data?.token.jwt])

  return <>{children}</>
}
