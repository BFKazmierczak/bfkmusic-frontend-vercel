'use client'

import { SongType } from '@/src/gql/graphql'

import SongPlayerAction from '../SongPlayerAction/SongPlayerAction'
import { useSession } from 'next-auth/react'

import moment from 'moment'
import 'moment/locale/pl'

interface SongHistoryProps {
  song: SongType
}

const SongViewDetailed = ({ song }: SongHistoryProps) => {
  const session = useSession()

  return (
    <>
      <div className=" flex flex-col gap-y-1 w-full">
        <span className=" font-bold text-sm text-neutral-500">
          Dodano{' '}
          <span className=" text-neutral-600">
            {moment(song.audioFiles[0]?.createdAt).format('LLL')}
          </span>
        </span>
        <SongPlayerAction song={song} audioIndex={0} />

        {song.inLibrary && (
          <div className=" mt-5 mb-2 text-sm">
            <div className=" flex w-full bg-black h-[1px]" />
            <span>Poprzednie odsłony:</span>
          </div>
        )}

        {!song.inLibrary && (
          <span className=" text-sm italic text-neutral-500">
            Ten utwór nie jest w Twojej bibliotece
          </span>
        )}

        {song.audioFiles.map((audio, index) => {
          if (index > 0) {
            return (
              <div className=" px-5" key={audio?.id}>
                <span className=" text-sm text-neutral-500">
                  Dodano{' '}
                  <span className=" font-bold text-neutral-600">
                    {moment(song.audioFiles[index]?.createdAt).format('LLL')}
                  </span>
                </span>
                <SongPlayerAction song={song} audioIndex={index} />
              </div>
            )
          }
        })}
      </div>
    </>
  )
}

export default SongViewDetailed
