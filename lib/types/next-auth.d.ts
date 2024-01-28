import NextAuth from 'next-auth'

declare module 'next-auth' {
  export interface Session {
    user: {
      jwt: string
      id: number
      username: string
      email: string
      role: {
        id: string
        name: string
        description: string
        type: string
      }
    }
  }
}
