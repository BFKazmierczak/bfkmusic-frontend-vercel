'use client'

import { LegacyRef, MutableRefObject, useEffect, useRef, useState } from 'react'
import PopupMenuItem from './PopupMenuItem'
import { signIn, signOut } from 'next-auth/react'

type PopupMenuInterface = {
  open: boolean
  setOpen: (state: boolean) => void
  loggedIn?: boolean
} & (
  | {
      left: boolean
      right?: never
    }
  | {
      left?: never
      right: boolean
    }
)

const useOutsideAlerter = (
  ref: MutableRefObject<LegacyRef<HTMLDivElement>>,
  callback: () => void
) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback])
}

const PopupMenu = ({
  open,
  setOpen,
  loggedIn = false,
  left,
  right
}: PopupMenuInterface) => {
  const menuRef = useRef(null)
  useOutsideAlerter(menuRef, () => setOpen(false))

  return (
    <div
      className={`absolute z-50 w-48 
        ${left && 'left-0 text-left'} 
        ${right && 'right-0 text-right'} 
        ${!open && 'hidden'}
       bg-neutral-300 outline-none shadow-md top-16 `}
      tabIndex={0}
      ref={menuRef}
      //   onBlur={() => setOpen(false)}
    >
      {loggedIn && (
        <div className=" flex flex-col gap-y-3 p-5">
          <PopupMenuItem text="Mój profil" href="/account" />

          <PopupMenuItem text="Ustawienia" href="/settings" />

          <PopupMenuItem text="Wyloguj się" onClick={() => signOut()} />
        </div>
      )}

      {!loggedIn && (
        <div className=" flex flex-col gap-y-3 p-5">
          <PopupMenuItem text="Zaloguj się" onClick={() => signIn()} />
        </div>
      )}
    </div>
  )
}

export default PopupMenu
