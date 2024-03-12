'use client'

import { SongEntity } from '@/src/gql/graphql'
import { useState } from 'react'
import SongPlayer from '../SongPlayer/SongPlayer'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { gql, useMutation } from '@apollo/client'
import { graphql } from '@/src/gql'

interface SongLibraryProps {
  songs: SongEntity[]
}

const SongLibrary = ({ songs }: SongLibraryProps) => {
  const router = useRouter()
  const session = useSession()

  return (
    <div className=" flex flex-col gap-y-2 max-h-fit overflow-y-auto px-5 bg-green-200">
      {songs.map((song) => (
        <SongPlayer
          key={song.id}
          song={song}
          size="small"
          showMainName
          admin={session.data?.user.role.name === 'Admin'}>
          <div className=" flex flex-col gap-y-1">
            {song.attributes?.isOwned && (
              <span className=" font-bold text-pink-600 select-none">
                <button
                  className=" small-button"
                  onClick={() => router.push(`/song/${song.id}`)}>
                  Zobacz więcej
                </button>
              </span>
            )}
          </div>
        </SongPlayer>
      ))}
    </div>
  )
}

export default SongLibrary
