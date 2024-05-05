import { create } from 'zustand'
import { SongType } from '../gql/graphql'
import { RefObject } from 'react'
import formatTime from '../utils/formatTime'

type GlobalPlayerStore = {
  songData: SongType | undefined
  current: HTMLAudioElement | undefined
  setCurrent: (current: HTMLAudioElement) => void
  playing: boolean
  play: () => void
  pause: () => void
  playSong: (newSongData: SongType, time?: number, audioIndex?: number) => void
  changeTime: (newTime: number) => void
  endSong: () => void
  currentTime: number
  setCurrentTime: (newTime: number) => void
  currentFormattedTime: string
  duration: number
  source: string
}

const useGlobalPlayerStore = create<GlobalPlayerStore>()((set) => ({
  songData: undefined,
  current: undefined,
  setCurrent: (current) => {
    set((state) => ({ current }))
  },
  playing: false,
  play: () => {},
  pause: () => {
    set((state) => {
      console.log('pausing...')
      state.current?.pause()
      return { playing: false }
    })
  },
  playSong: (newSongData, time = 0, audioIndex = 0) => {
    set((state) => {
      if (state.songData?.id === newSongData.id) {
        return { currentTime: time, playing: true }
      } else {
        const newSrc = newSongData.audioFiles[audioIndex]?.file
        const duration = newSongData.audioFiles[audioIndex]?.duration

        console.log({ newSrc })

        if (state.current && newSrc) {
          state.current.src = newSrc
          state.current.currentTime = time
        }

        return {
          songData: newSongData,
          currentTime: time,
          source: newSrc,
          duration: duration ? duration : 0,
          playing: true
        }
      }
    })
  },
  changeTime: (newTime) => {
    set((state) => {
      if (state.current) state.current.currentTime = newTime
      return {
        currentTime: newTime,
        currentFormattedTime: formatTime(newTime)
      }
    })
  },
  endSong: () =>
    set((state) => ({
      playing: false,
      currentTime: 0,
      currentFormattedTime: formatTime(0)
    })),
  currentTime: 0,
  setCurrentTime: (newTime) => {
    set((state) => {
      return {
        currentTime: newTime,
        currentFormattedTime: formatTime(newTime)
      }
    })
  },
  currentFormattedTime: '00:00',
  duration: 0,
  source: ''
}))

export default useGlobalPlayerStore
