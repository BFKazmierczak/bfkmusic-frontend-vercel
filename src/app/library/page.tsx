import { getClient } from '@/lib/client'
import { SongLibraryView } from '@/src/components/Media/SongLibrary'
import { SongEntity } from '@/src/gql/graphql'
// import { GET_LIBRARY } from './queries'

async function LibraryPage() {
  // const songsResult = await getClient().query({
  //   query: GET_LIBRARY,
  //   variables: {
  //     pagination: {
  //       page: 1,
  //       pageSize: 10
  //     }
  //   }
  // })

  // const songs = songsResult.data.songs?.data as SongEntity[]

  return <SongLibraryView />
}

export const dynamic = 'force-dynamic'

export default LibraryPage
