'use client'

import { ApolloLink, HttpLink, from } from '@apollo/client'
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink
} from '@apollo/experimental-nextjs-app-support/ssr'
import { useSession } from 'next-auth/react'
import errorLink from './errorLink'

function makeClient(token: string) {
  console.log('making client...')

  const httpLink = new HttpLink({
    uri: process.env.GRAPHQL_ENDPOINT,
    fetch,
    headers: { authorization: `Bearer ${token}` }
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
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true
            }),
            from([errorLink, httpLink])
          ])
        : (() => from([errorLink, httpLink]))()
  })
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const session = useSession()

  const jwt = session.data?.user?.jwt

  console.log({ jwt })

  return (
    <>
      {session.status !== 'loading' ? (
        <ApolloNextAppProvider
          makeClient={() => makeClient(session.data?.user?.jwt || '')}>
          {children}
        </ApolloNextAppProvider>
      ) : (
        <></>
      )}
    </>
  )
}
