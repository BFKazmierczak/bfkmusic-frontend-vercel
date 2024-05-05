import { getClient } from '@/lib/client'
import { graphql } from '@/src/gql'

import SongViewDetailed from '@/src/components/Media/SongViewDetailed/SongViewDetailed'
import { gql } from '@apollo/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SongType } from '@/src/gql/graphql'

const GET_SONG = graphql(`
  query GetSong($songId: ID!) {
    song(songId: $songId) {
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
        }
        name
        description
        duration
        waveform
        file
        comments {
          id
          createdAt
          updatedAt
          content
          user {
            id
            username
          }
          startTime
          endTime
        }
      }
    }
  }
`)
interface SongPageProps {
  params: {
    songId: string
  }
}

const SongPage = async ({ params }: SongPageProps) => {
  // const session = await getServerSession(authOptions)

  console.log({ params })

  const songQuery = await getClient().query({
    query: GET_SONG,
    variables: {
      songId: decodeURIComponent(params.songId)
    }
  })

  const songData = songQuery.data.song

  console.log({ songData })

  if (!songData) {
    return (
      <div className=" flex justify-center items-center text-red-500">
        Nie udało się pozyskać utworu
      </div>
    )
  }

  return (
    <>
      <div className=" flex w-full flex-col gap-y-2">
        <div>
          <span className="  flex font-bold text-lg">{songData?.name}</span>
          <div className=" flex w-full bg-black h-[2px]" />
        </div>

        <SongViewDetailed song={songData as SongType} />
      </div>
    </>
  )
}

export default SongPage
