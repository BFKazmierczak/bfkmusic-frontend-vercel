'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import { SongType } from '@/src/gql/graphql'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import AudioSlider from '../AudioSlider/AudioSlider'
import useHighlightStore from '../../../stores/highlightStore'
import useGlobalPlayerStore from '@/src/stores/globalPlayerStore'
import formatTime from '@/src/utils/formatTime'

export interface SongPlayerProps {
  song: SongType
  audioIndex?: number
  size?: 'small' | 'normal'
  showMainName?: boolean
  children?: ReactNode
  admin?: boolean
}

const SongPlayer = ({
  song,
  audioIndex = 0,
  size = 'normal',
  showMainName = false,
  children,
  admin = false
}: SongPlayerProps) => {
  const {
    songData,
    pause,
    playing,
    playSong,
    changeTime,
    currentTime,
    source
  } = useGlobalPlayerStore()

  const { highlight } = useHighlightStore()

  const [localPlaying, setLocalPlaying] = useState<boolean>(false)
  const [innerTime, setInnerTime] = useState<number>(0)
  const [innerFormattedTime, setInnerFormattedTime] = useState<string>('0:00')

  const thisPlaying = useMemo(() => {
    return song?.audioFiles[audioIndex]?.file === source
  }, [source])

  const audioDuration = useMemo((): number => {
    if (song.audioFiles && song.audioFiles.length) {
      const data = song.audioFiles[audioIndex]

      return (data?.duration as number) ?? 0
    }

    return 0
  }, [song])

  useEffect(() => {
    if (thisPlaying) {
      if (playing) setLocalPlaying(true)
      else setLocalPlaying(false)
    }
  }, [thisPlaying, playing])

  useEffect(() => {
    if (thisPlaying) {
      setInnerTime(currentTime)
      setInnerFormattedTime(formatTime(currentTime))
    }
  }, [thisPlaying, currentTime])

  useEffect(() => {
    if (thisPlaying) setLocalPlaying(true)
    else setLocalPlaying(false)
  }, [source])

  return (
    <div className=" flex flex-row bg-neutral-300 sm:w-96 z-[7 0] ">
      <div className=" flex justify-center items-center aspect-square text-white bg-pink-600">
        {localPlaying ? (
          <div
            onClick={() => {
              pause()
            }}>
            <PauseIcon />
          </div>
        ) : (
          <div
            onClick={() => {
              const time = innerTime > 0 ? innerTime : undefined

              playSong(song, time, audioIndex)
            }}>
            <PlayArrowIcon />
          </div>
        )}
      </div>

      <div
        className={` flex w-full flex-col gap-y-2 p-3 overflow-x-hidden ${
          size === 'small' && 'items-start'
        } `}>
        <div className=" flex justify-between w-full gap-x-2 items-center">
          <span
            className=" flex w-fit font-bold text-sm"
            style={{
              whiteSpace: 'nowrap',
              display: 'flex',
              overflow: 'auto'
            }}>
            {showMainName && song?.name}
            {!showMainName &&
              ((song?.audioFiles[audioIndex]?.name.length as number) > 1
                ? song?.audioFiles[audioIndex]?.name
                : 'Plik bez nazwy')}
          </span>
        </div>

        {size !== 'small' && (
          <div>
            <AudioSlider
              totalTime={audioDuration}
              currentTime={innerTime}
              // highlight={
              //   highlight[1] === Number(file?.id) ? highlight[0] : undefined
              // }
              onTimeChange={(newTime) => {
                changeTime(newTime)
              }}
            />

            <div className=" flex w-full">
              <span>{innerFormattedTime} /</span>
              <span>{formatTime(audioDuration)}</span>
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  )
}

export default SongPlayer
