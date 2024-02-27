'use client'

import { ApolloLink, HttpLink } from '@apollo/client'
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink
} from '@apollo/experimental-nextjs-app-support/ssr'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

function makeClient(token: string) {
  const httpLink = new HttpLink({
    uri: process.env.GRAPHQL_ENDPOINT,
    fetch,
    headers: { authorization: `Bearer ${token}` }
  })

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true
            }),
            httpLink
          ])
        : httpLink
  })
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const session = useSession()

  const jwt = session.data?.user?.jwt

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
