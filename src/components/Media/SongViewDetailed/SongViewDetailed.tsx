'use client'

import { SongEntity } from '@/src/gql/graphql'

import SongPlayerAction from '../SongPlayerAction/SongPlayerAction'
import { useSession } from 'next-auth/react'

interface SongHistoryProps {
  song: SongEntity
}

const SongViewDetailed = ({ song }: SongHistoryProps) => {
  const session = useSession()

  return (
    <>
      <div className=" flex flex-col gap-y-3 w-full">
        {song.attributes?.audio?.data.map((audio, index) => {
          return (
            <>
              <SongPlayerAction
                song={song}
                audioIndex={index}
                admin={session.data?.user.role.name === 'Admin'}
              />
              {index === 0 && <span>Starsze wersje tego utworu</span>}
            </>
          )
        })}
      </div>
    </>
  )
}

export default SongViewDetailed
