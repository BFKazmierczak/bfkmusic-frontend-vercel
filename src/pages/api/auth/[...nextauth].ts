import { authOptions } from '@/lib/auth'
import NextAuth from 'next-auth'
import { NextAuthOptions } from 'next-auth'

export default NextAuth(authOptions as NextAuthOptions)
