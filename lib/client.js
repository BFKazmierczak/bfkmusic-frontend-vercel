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
import errorLink from './errorLink'

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT
})

const authLink = setContext(async () => {
  const session = await getServerSession(authOptions)

  console.log({ session })

  if (!session?.user?.jwt) return {}

  return {
    headers: {
      authorization: `Bearer ${session.user.jwt}`
    }
  }
})

export const { getClient } = registerApolloClient(
  () =>
    new NextSSRApolloClient({
      cache: new NextSSRInMemoryCache(),
      link: from([errorLink, authLink.concat(httpLink)])
    })
)
