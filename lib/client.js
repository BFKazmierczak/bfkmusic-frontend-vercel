import { HttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import {
  NextSSRInMemoryCache,
  NextSSRApolloClient
} from '@apollo/experimental-nextjs-app-support/ssr'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'
import fetch from 'cross-fetch'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import serverErrorLink from './serverErrorLink'

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT
})

const authLink = setContext(async () => {
  const session = await getServerSession(authOptions)

  if (!session?.token.jwt) return {}

  return {
    headers: {
      authorization: `Bearer ${session.token.jwt}`
    }
  }
})

export const { getClient } = registerApolloClient(
  () =>
    new NextSSRApolloClient({
      cache: new NextSSRInMemoryCache(),
      defaultOptions: {
        query: {
          errorPolicy: 'all'
        },
        mutate: {
          errorPolicy: 'all'
        }
      },
      link: from([serverErrorLink, authLink.concat(httpLink)])
    })
)
