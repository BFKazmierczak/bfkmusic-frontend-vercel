import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import LoginButton from '../components/Buttons/LoginButton'
import DebugButton from '@/src/components/_debug/DebugButton'
import { NextAuthOptions } from 'next-auth'

const HomePage = async () => {
  const session = await getServerSession(authOptions as NextAuthOptions)

  return (
    <div className=" p-10 sm:p-0 selection:bg-pink-600 sm:mt-32 flex flex-col gap-y-2">
      <p className=" font-bold text-3xl sm:text-[48px] text-left sm:text-center">
        {session ? 'Witaj ponownie!' : 'Witaj na platformie BFK Music'}
      </p>
      <p className=" text-lg sm:text-2xl text-left sm:text-center">
        Jesteś zalogowany.
      </p>

      <DebugButton />

      {session === null && (
        <div className=" flex flex-col items-center gap-y-2 mt-5">
          <Link className=" basic-button" href="/register">
            Zarejestruj się
          </Link>
          LUB
          <LoginButton />
        </div>
      )}
    </div>
  )
}

export default HomePage
