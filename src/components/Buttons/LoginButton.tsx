'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

const LoginButton = () => {
  return (
    <button className=" secondary-button" onClick={() => signIn()}>
      Zaloguj się
    </button>
  )
}

export default LoginButton
