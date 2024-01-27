'use client'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useState } from 'react'
import PopupMenu from '../Menus/PopupMenu/PopupMenu'

interface UserAvatarProps {
  loggedIn: boolean
}

const UserAvatar = ({ loggedIn }: UserAvatarProps) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  return (
    <div className=" relative ">
      <AccountCircleIcon
        className=" cursor-pointer active:text-neutral-500 transition-all ease-in-out"
        style={{ fontSize: '3em' }}
        onClick={() => setMenuOpen((prev) => !prev)}
      />

      <PopupMenu
        open={menuOpen}
        setOpen={setMenuOpen}
        loggedIn={loggedIn}
        right
      />

      {/* <div
        className={` absolute ${
          !menuOpen && ' hidden'
        } right-1 bg-neutral-400`}>
        DUPSKOoo{' '}
      </div> */}
    </div>
  )
}

export default UserAvatar
