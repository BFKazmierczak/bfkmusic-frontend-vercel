'use client'

import { SongEntity } from '@/src/gql/graphql'
import { useState } from 'react'
import SongPlayer from '../SongPlayer/SongPlayer'
import { useRouter } from 'next/navigation'

interface SongLibraryProps {
  songs: SongEntity[]
}

const SongLibrary = ({ songs }: SongLibraryProps) => {
  const router = useRouter()

  return (
    <div className=" flex flex-col gap-y-2 max-h-fit overflow-y-auto px-5 bg-green-200">
      {songs.map((song) => (
        <SongPlayer key={song.id} song={song} size="small" showMainName>
          {song.attributes?.isOwned && (
            <span className=" font-bold text-pink-600 select-none">
              <button
                className=" small-button"
                onClick={() => router.push(`/song/${song.id}`)}>
                Zobacz więcej
              </button>
            </span>
          )}
        </SongPlayer>
      ))}
    </div>
  )
}

export default SongLibrary
