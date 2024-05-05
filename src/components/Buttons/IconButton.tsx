import { ReactNode } from 'react'

interface IconButtonProps {
  children: ReactNode
  icon: ReactNode
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void
}

const IconButton = ({ children, icon, onClick }: IconButtonProps) => {
  return (
    <>
      <div
        className=" flex gap-x-1 text-neutral-600 hover:bg-neutral-400 hover:text-neutral-800 cursor-pointer transition-all ease-in-out"
        onClick={onClick}>
        {icon}
        {children}
      </div>
    </>
  )
}

export default IconButton
