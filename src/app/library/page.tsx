import { getClient } from '@/lib/client'
import { SongLibraryView } from '@/src/components/Media/SongLibrary'
import { SongEntity } from '@/src/gql/graphql'
import { GET_LIBRARY, GET_OWNED_SONGS } from './queries'

async function LibraryPage() {
  const songsResult = await getClient().query({
    query: GET_LIBRARY,
    variables: {
      pagination: {
        page: 1,
        pageSize: 10
      }
    }
  })

  const ownedSongsResult = await getClient().query({
    query: GET_OWNED_SONGS,
    variables: {}
  })

  const songs = songsResult.data.songs?.data as SongEntity[]
  const ownedSongs = ownedSongsResult.data.ownedSongs?.data as SongEntity[]

  return <SongLibraryView initialSongs={songs} initialOwnedSongs={ownedSongs} />
}

export const dynamic = 'force-dynamic'

export default LibraryPage
