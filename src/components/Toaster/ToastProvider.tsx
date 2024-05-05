'use client'

import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

interface ToastProviderProps {
  children: ReactNode
}

const ToastProvider = () => {
  return (
    <>
      <ToastContainer />
    </>
  )
}

export default ToastProvider
