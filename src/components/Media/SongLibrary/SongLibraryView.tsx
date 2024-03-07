'use client'

import { SongEntity } from '@/src/gql/graphql'
import { SongLibrary } from '.'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface SongLibraryViewProps {
  initialSongs: SongEntity[]
  initialOwnedSongs: SongEntity[]
}

const SongLibraryView = ({
  initialSongs,
  initialOwnedSongs
}: SongLibraryViewProps) => {
  const [songs, setSongs] = useState<SongEntity[]>(initialSongs)
  const [ownedSongs, setOwnedSongs] = useState<SongEntity[]>(initialOwnedSongs)

  const [displayedSongs, setDisplayedSongs] = useState<SongEntity[]>(songs)

  const [selected, setSelected] = useState<'all' | 'bought'>('all')

  useEffect(() => {
    if (selected === 'all') setDisplayedSongs(songs)
    else setDisplayedSongs(ownedSongs)
  }, [selected])

  return (
    <>
      <div className=" flex flex-col gap-y-5">
        <h1 className=" flex justify-center mt-5">Moja biblioteka</h1>

        <div className=" flex gap-x-5 justify-center">
          <span
            className={`${selected === 'all' && 'text-pink-600'}`}
            onClick={() => setSelected('all')}>
            Wszystkie
          </span>
          <span
            className={`${selected === 'bought' && 'text-pink-600'}`}
            onClick={() => setSelected('bought')}>
            Zakupione
          </span>
        </div>

        <div className=" flex flex-col gap-y-5">
          {displayedSongs.length > 0 && (
            <SongLibrary initialSongs={displayedSongs} />
          )}
          <div className=" flex justify-center px-10">
            {displayedSongs.length === 0 && (
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
    </>
  )
}

export default SongLibraryView
