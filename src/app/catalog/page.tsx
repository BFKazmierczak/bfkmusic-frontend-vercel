import { getClient } from '@/lib/client'
import SongList from '@/src/components/Media/SongList'
import { graphql } from '@/src/gql'
import { SongType } from '@/src/gql/graphql'
import { gql } from '@apollo/client'

// export const dynamic = 'force-dynamic'

const GET_SONGS = graphql(`
  query GetSongs($first: Int) {
    allSongs(first: $first) {
      edges {
        cursor
        node {
          id
          createdAt
          updatedAt
          publishedAt
          name
          description
          inLibrary
          isFavorite
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
  }
`)

const CatalogPage = async () => {
  const result = await getClient().query({
    query: GET_SONGS,
    variables: {
      first: 10
    }
  })

  const songs = result?.data.allSongs?.edges.map(
    (edge) => edge?.node
  ) as SongType[]

  return (
    <>
      {songs && <SongList initialSongs={songs} />}{' '}
      {!songs && <p>Nie udało się pobrać utworów</p>}{' '}
    </>
  )
}

export const dynamic = 'force-dynamic'

export default CatalogPage
