import NextAuth from 'next-auth'

declare module 'next-auth/jwt' {
  export interface JWT {
    jwt: string
    jti: string
    user: User
    iss: string
    iat: number
    exp: number
    context: {
      username: string
      first_name: string
      last_name: string
      groups: []
    }
  }
}

declare module 'next-auth' {
  export interface User {
    jwt: string
    id: number
    username: string
    firstName: string
    lastName: string
    email: string
  }

  export interface Session {
    user: User
  }
}
