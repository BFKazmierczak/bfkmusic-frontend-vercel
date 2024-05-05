'use client'

import { useEffect, useState } from 'react'
import { SongType, AudioType } from '@/src/gql/graphql'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import useGlobalPlayerStore from '@/src/stores/globalPlayerStore'

interface SongVersionProps {
  song: SongType
  audio: AudioType
  audioIndex?: number
}

const SongVersion = ({ song, audio, audioIndex }: SongVersionProps) => {
  const { songData, playing, playSong, pause, currentTime, source } =
    useGlobalPlayerStore()

  const [localPlaying, setLocalPlaying] = useState<boolean>(false)

  const [innerTime, setInnerTime] = useState<number>(0)

  useEffect(() => {
    if (songData?.id === song.id) {
      setInnerTime(currentTime)
      // setInnerFormattedTime(formatTime(currentTime))
    }
  }, [currentTime])

  useEffect(() => {
    if (songData?.id === song.id && audio.attributes?.url === source) {
      if (playing) setLocalPlaying(true)
      else if (!playing) setLocalPlaying(false)
    }
  }, [playing])

  return (
    <>
      <div className=" bg-neutral-200">
        {localPlaying ? (
          <div
            onClick={() => {
              pause()
            }}>
            <PauseIcon style={{ fontSize: '3rem' }} />
          </div>
        ) : (
          <div
            onClick={() => {
              const time = innerTime > 0 ? innerTime : undefined

              playSong(song, time, audioIndex)
            }}>
            <PlayArrowIcon style={{ fontSize: '3rem' }} />
          </div>
        )}

        <span>{audio.attributes?.name}</span>
      </div>
    </>
  )
}

export default SongVersion
