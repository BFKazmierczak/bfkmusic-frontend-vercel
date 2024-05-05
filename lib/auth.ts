import fetch from 'cross-fetch'
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { graphql } from '@/src/gql'
import { JWT } from 'next-auth/jwt'

function parseJwt(token: string) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  return JSON.parse(jsonPayload)
}

function makeClient() {
  const client = new ApolloClient({
    name: 'AuthClient',
    link: new HttpLink({
      uri: process.env.GRAPHQL_ENDPOINT,
      fetch: fetch
    }),
    cache: new InMemoryCache()
  })

  return client
}

const LOGIN = graphql(`
  mutation Login($username: String!, $password: String!) {
    userLogin(username: $username, password: $password) {
      token
      user {
        id
        username
        firstName
        lastName
        email
      }
    }
  }
`)

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 1 * 60 * 60 - 120 // expire prior to server expiration
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const decodedPayload = parseJwt(user.jwt)
        return { ...user, ...decodedPayload }
      }

      return token
    },
    async session({ session, user, token }) {
      console.log('accessing the session', { session })

      const modifiedSession = { ...session }
      modifiedSession.token = token
      modifiedSession.user = { ...token.user }

      return modifiedSession
    }
  },
  providers: [
    CredentialsProvider({
      id: 'cred',
      name: 'CredentialsLogin',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },

      async authorize(credentials, req) {
        const client = makeClient()

        const response = await client.mutate({
          mutation: LOGIN,
          variables: {
            username: `${credentials?.username}`,
            password: `${credentials?.password}`
          }
        })

        if (response && response.data) {
          const data = response.data.userLogin

          const jwt = data.token
          const user = { ...data.user }

          const authorizedUser = { jwt, user }

          return authorizedUser
        }

        return null
      }
    })
  ]
}
