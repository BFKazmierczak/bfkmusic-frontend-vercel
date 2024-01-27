'use client'

import getTimeRangeNumberArray from '@/src/utils/getTimeRangeNumberArray'
import { useEffect, useMemo, useRef, useState } from 'react'

interface AudioSliderProps {
  totalTime: number
  currentTime: number
  highlight?: string
  onTimeChange?: (newTime: number) => void
}

const AudioSlider = ({
  totalTime,
  currentTime,
  highlight,
  onTimeChange
}: AudioSliderProps) => {
  const [pointWidth, setPointWidth] = useState<string>()
  const [progress, setProgress] = useState<string>('0')

  const [highlightRange, setHighlightRange] = useState<number[]>()
  const [highlightWidth, setHighlightWidth] = useState<string>('0')

  const [moving, setMoving] = useState<boolean>(false)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current && totalTime) {
      if (typeof containerRef.current?.clientWidth === 'number') {
        const width = (containerRef.current.clientWidth / totalTime).toFixed(2)

        setPointWidth(width)
      }
    }
  }, [containerRef.current, totalTime])

  useEffect(() => {
    setProgress(((currentTime / totalTime) * 100).toFixed(2))
  }, [currentTime])

  useEffect(() => {
    if (highlight) {
      setHighlightRange(getTimeRangeNumberArray(highlight.split(':')))
    } else setHighlightRange(undefined)
  }, [highlight])

  useEffect(() => {
    if (highlightRange) {
      setHighlightWidth(
        (
          ((highlightRange[1] - highlightRange[0]) / totalTime) * 100 +
          2
        ).toFixed(2)
      )
    }
  }, [highlightRange])

  function handleProgressBarClick(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    const clientX = event.clientX
    const clientY = event.clientY

    if (containerRef.current) {
      const div = containerRef.current.getBoundingClientRect()

      const divX = div.left
      const divY = div.bottom

      const relativeX = clientX - divX
      const relativeY = divY - clientY

      const percentage = relativeX / div.width

      console.log('relativeX:', relativeX)
      console.log('div width:', div.width)

      console.log('percentage:', percentage)

      const newTime = percentage * totalTime

      console.log('new time:', newTime)
      if (onTimeChange) onTimeChange(newTime)
    }
  }

  return (
    <>
      <div
        className=" relative flex flex-row items-center group bg-neutral-400 hover:bg-neutral-500 
          h-2 w-full transition-colors ease-in-out"
        ref={containerRef}
        onMouseDown={(event) => setMoving(true)}
        onMouseMove={
          moving
            ? (event) => {
                handleProgressBarClick(event)
              }
            : undefined
        }
        onMouseUp={() => setMoving(false)}
        onMouseLeave={() => setMoving(false)}
        onClick={handleProgressBarClick}>
        <div
          className={` bg-pink-600 group-hover:bg-pink-700 h-2 transition-colors ease-in-out`}
          style={{ width: `${progress}%` }}
        />
        <div
          className={` absolute w-3 h-3 rounded-full z-auto bg-pink-800`}
          style={{ left: `${Number(progress) - 1}%` }}
        />
        {highlightRange && highlightWidth && (
          <div
            className={` absolute h-3 bg-opacity-50 bg-blue-700`}
            style={{
              left: `${(highlightRange[0] / totalTime) * 100}%`,
              width: `${highlightWidth}%`
            }}
          />
        )}
      </div>
    </>
  )
}

export default AudioSlider
