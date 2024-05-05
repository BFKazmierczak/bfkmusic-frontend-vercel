'use client'

import { SongType } from '@/src/gql/graphql'
import { SongLibrary } from '.'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { graphql } from '@/src/gql'

// const GET_SONGS = graphql(`
//   query GetLibrarySongs($filters: SongFiltersHiddenInput) {
//     songs(filters: $filters) {
//       data {
//         id
//         attributes {
//           createdAt
//           updatedAt
//           publishedAt
//           name
//           description
//           inLibrary
//           isOwned
//           non_owner_visible
//         }
//       }
//     }
//   }
// `)

interface SongLibraryViewProps {
  initialSongs?: SongType[]
}

const SongLibraryView = ({ initialSongs }: SongLibraryViewProps) => {
  const [songs, setSongs] = useState<SongType[]>([])

  const [selected, setSelected] = useState<'all' | 'bought'>('all')

  // const { data, loading } = useQuery(GET_SONGS, {
  //   variables: {
  //     filters
  //   }
  // })

  // useEffect(() => {
  //   if (data?.songs) setSongs(data.songs.data)
  // }, [data?.songs])

  // useEffect(() => {
  //   if (selected === 'all') setFilters({ inLibrary: true, isOwned: false })
  //   else setFilters({ inLibrary: false, isOwned: true })
  // }, [selected])

  return (
    <>
      <div className=" flex flex-col gap-y-5">
        <h1 className=" flex justify-center mt-5">Moja biblioteka</h1>

        <div className=" flex gap-x-5 justify-center">
          <span
            className={`${
              selected === 'all' && 'text-pink-600'
            } cursor-pointer select-none`}
            onClick={() => setSelected('all')}>
            Wszystkie
          </span>
          <span
            className={`${
              selected === 'bought' && 'text-pink-600'
            } cursor-pointer select-none`}
            onClick={() => setSelected('bought')}>
            Zakupione
          </span>
        </div>

        {/* <div className=" flex flex-col gap-y-5">
          {songs.length > 0 && !loading && <SongLibrary songs={songs} />}
          <div className=" flex justify-center px-10">
            {songs.length === 0 && !loading && (
              <span>
                Wygląda na to, że w Twojej bibliotece nie ma żadnej muzyki.
                Odwiedź{' '}
                <Link
                  className=" font-bold text-pink-600 hover:text-pink-700 active:text-pink-800"
                  href="/catalog">
                  katalog
                </Link>
                , aby dodać utwory.
              </span>
            )}

            {loading && <span>Wczytywanie danych</span>}
          </div>
        </div> */}
      </div>
    </>
  )
}

export default SongLibraryView
