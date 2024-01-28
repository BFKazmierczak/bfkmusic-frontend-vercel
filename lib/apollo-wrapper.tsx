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

function makeClient(token: string | undefined) {
  const httpLink = new HttpLink({
    uri: process.env.GRAPHQL_ENDPOINT,
    fetch,
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    }
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

  return (
    <ApolloNextAppProvider
      makeClient={() => makeClient(session.data?.user?.jwt)}>
      {children}
    </ApolloNextAppProvider>
  )
}
