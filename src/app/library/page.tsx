import { getClient } from '@/lib/client'
import { SongLibrary } from '@/src/components/Media/SongLibrary'
import SongList from '@/src/components/Media/SongList'
import SongPlayer from '@/src/components/Media/SongPlayer/SongPlayer'
import { graphql } from '@/src/gql'
import { SongEntity } from '@/src/gql/graphql'
import Link from 'next/link'

// export const dynamic = 'force-dynamic'

const GET_LIBRARY = graphql(`
  query GetLibrary($pagination: PaginationArg) {
    songs(pagination: $pagination, filters: { inLibrary: true }) {
      data {
        id
        attributes {
          createdAt
          updatedAt
          publishedAt
          name
          description
          inLibrary
          audio {
            data {
              id
              attributes {
                createdAt
                updatedAt
                name
                url
                duration
                waveform {
                  data {
                    id
                    attributes {
                      peaks
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`)

const LibraryPage = async () => {
  const result = await getClient().query({
    query: GET_LIBRARY,
    variables: {
      pagination: {
        page: 1,
        pageSize: 10
      }
    }
  })

  const songs = result.data.songs?.data as SongEntity[]

  return (
    <div className=" flex flex-col gap-y-5">
      <h1 className=" flex justify-center mt-5">Moja biblioteka</h1>

      <div className=" flex flex-col gap-y-5">
        {songs.length > 0 && <SongLibrary initialSongs={songs} />}

        <div className=" flex justify-center px-10">
          {songs.length === 0 && (
            <span>
              Wygląda na to, że w Twojej bibliotece nic nie ma. Odwiedź{' '}
              <Link
                className=" font-bold text-pink-600 hover:text-pink-700 active:text-pink-800"
                href="/catalog">
                katalog
              </Link>
              , aby dodać utwory.
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

export default LibraryPage
