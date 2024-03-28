'use client'

import { SongEntity } from '@/src/gql/graphql'
import SongPlayer from './SongPlayer/SongPlayer'

import AddIcon from '@mui/icons-material/Add'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { graphql } from '@/src/gql'
import { useSession } from 'next-auth/react'

const ADD_TO_LIBRARY = graphql(`
  mutation AddToLibrary($songId: Int!) {
    addSongToLibrary(songId: $songId) {
      data {
        id
        attributes {
          name
          description
          inLibrary
          createdAt
          updatedAt
          publishedAt
          audio {
            data {
              id
              attributes {
                name
                alternativeText
                caption
                url
                duration
              }
            }
          }
        }
      }
    }
  }
`)

interface SongEntityObject {
  [key: string]: SongEntity
}

interface SongListProps {
  initialSongs: SongEntity[] | []
}

const SongList = ({ initialSongs }: SongListProps) => {
  const session = useSession()

  const [songs, setSongs] = useState<SongEntityObject>(() => {
    const temp: SongEntityObject = {}

    initialSongs.forEach((song) => {
      temp[song.id as string] = song
    })

    return temp
  })

  const [addToLibrary] = useMutation(ADD_TO_LIBRARY, {
    onCompleted: (data) => {
      const newSong = data.addSongToLibrary?.data
      const newId = newSong?.id

      if (newSong && newId) {
        setSongs((prev) => ({ ...prev, [newId]: newSong } as SongEntityObject))
      }
    }
  })

  function testFunc(event: React.MouseEvent<HTMLButtonElement>, id: number) {
    addToLibrary({
      variables: {
        songId: id
      }
    })
  }

  function handleAdd(songId: number) {
    return (event: React.MouseEvent<HTMLButtonElement>) =>
      testFunc(event, songId)
  }

  return (
    <div className=" flex flex-col gap-y-5 my-10">
      {Object.values(songs)?.map((song: SongEntity) => {
        const audioData = song.attributes?.audio?.data

        if (audioData && audioData.length > 0) {
          return (
            <SongPlayer key={song.id} song={song} showMainName>
              {song.attributes?.inLibrary ? (
                <span className=" flex items-center w-fit h-7 gap-x-1 text-sm select-none font-bold text-pink-600">
                  <CheckBoxIcon style={{ fontSize: '1.25rem' }} />
                  <span className=" text-[13px]">W bibliotece</span>
                </span>
              ) : (
                session.data && (
                  <button
                    className=" small-button h-7"
                    onClick={handleAdd(Number(song.id))}>
                    <span className=" flex justify-center items-center gap-x-1">
                      <AddIcon style={{ fontSize: '1rem' }} />
                      <span className=" hidden sm:inline">Do biblioteki</span>
                    </span>
                  </button>
                )
              )}
            </SongPlayer>
          )
        }
      })}
    </div>
  )
}

export default SongList
