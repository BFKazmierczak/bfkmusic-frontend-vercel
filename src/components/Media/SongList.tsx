'use client'

import { SongType } from '@/src/gql/graphql'
import SongPlayer from './SongPlayer/SongPlayer'

import AddIcon from '@mui/icons-material/Add'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { gql, useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { graphql } from '@/src/gql'
import { useSession } from 'next-auth/react'
import { Tooltip } from '@mui/material'

import { toast } from 'react-toastify'

import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useRouter } from 'next/navigation'

const MANAGE_FAVORITE = graphql(`
  mutation ManageFavorite($songId: ID!) {
    songManageFavorite(songId: $songId) {
      success
      song {
        id
        createdAt
        updatedAt
        publishedAt
        inLibrary
        isFavorite
        name
        description
        audioFiles {
          id
          createdAt
          updatedAt
          uploadedBy {
            id
            username
            email
          }
          name
          description
          duration
          waveform
          file
        }
      }
    }
  }
`)

interface SongTypeObject {
  [key: string]: SongType
}

interface SongListProps {
  initialSongs: SongType[] | []
}

const SongList = ({ initialSongs }: SongListProps) => {
  const session = useSession()
  const router = useRouter()

  const [songs, setSongs] = useState<SongTypeObject>(() => {
    const temp: SongTypeObject = {}

    initialSongs.forEach((song) => {
      temp[song.id as string] = song
    })

    return temp
  })

  const [manageFavorite] = useMutation(MANAGE_FAVORITE, {
    onCompleted: (data) => {
      const newSong = data?.songManageFavorite?.song

      console.log({ newSong })
      const newId = newSong?.id

      if (newSong && newId) {
        setSongs((prev) => ({ ...prev, [newId]: newSong } as SongTypeObject))

        let message = 'Dodano do ulubionych'
        if (!newSong.isFavorite) message = 'Usunięto z ulubionych'

        toast(message, { type: 'success', theme: 'colored' })
      }
    }
  })

  useEffect(() => {
    console.log({ songs })
  }, [songs])

  function testFunc(event: React.MouseEvent<HTMLButtonElement>, id: string) {
    manageFavorite({
      variables: {
        songId: id
      }
    })
  }

  function handleAdd(songId: string) {
    return (event: React.MouseEvent<HTMLButtonElement>) =>
      testFunc(event, songId)
  }

  return (
    <div className=" flex flex-col w-full px-10 gap-y-5 my-10">
      {Object.values(songs)?.map((song: SongType) => {
        const audioData = song.audioFiles

        if (audioData && audioData.length > 0) {
          return (
            <SongPlayer key={song.id} song={song} showMainName>
              <div className=" flex justify-between items-end text-sm">
                <span
                  className=" flex items-center gap-x-1 font-bold text-[14px] text-pink-700 underline select-none cursor-pointer"
                  onClick={() => router.push(`/song/${song.id}`)}>
                  Otwórz
                  <OpenInNewIcon style={{ fontSize: '0.9rem' }} />
                </span>

                {session.status === 'authenticated' && (
                  <Tooltip
                    title={
                      song.isFavorite
                        ? 'W ulubionych (kliknij, aby usunąć)'
                        : 'Dodaj do ulubionych'
                    }
                    placement="left">
                    <span onClick={handleAdd(song.id)}>
                      {song.isFavorite && (
                        <FavoriteIcon
                          style={{ fontSize: '1.25rem', color: '#be185d' }}
                        />
                      )}

                      {!song.isFavorite && (
                        <FavoriteBorderIcon style={{ fontSize: '1.25rem' }} />
                      )}
                    </span>
                  </Tooltip>
                )}
              </div>
            </SongPlayer>
          )
        }
      })}
    </div>
  )
}

export default SongList
