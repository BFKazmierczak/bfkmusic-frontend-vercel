'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NavbarItem from '@/src/interfaces/NavbarItem'

interface MainNavbarProps {
  items: NavbarItem[]
}

const MainNavbar = ({ items }: MainNavbarProps) => {
  const pathname = usePathname()

  return (
    <div className=" flex flex-row items-end text-left gap-x-4">
      {items?.map((item) => {
        return (
          <Link
            className={` ${
              pathname === item.href && 'text-pink-600 underline'
            } text-2xl transition-all ease-in-out`}
            key={item.href}
            href={item.href}>
            {item.name}
          </Link>
        )
      })}
    </div>
  )
}

export default MainNavbar
