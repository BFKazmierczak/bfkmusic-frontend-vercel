import { useEffect, useRef, useState } from 'react'
import MarkerButton from './MarkerButton/MarkerButton'
import usePrevious from '@/src/hooks/usePrevious'
import { CommentRange } from '../SongPlayerAction/SongPlayerAction'
import { CustomHighlightType } from '@/src/stores/highlightStore'
import formatTime from '@/src/utils/formatTime'

/** Interface for WaveformProps
 *
 *  @param isSelectingRange Indicates whether comment range is currently being selected
 */
interface WaveformProps {
  peaks: number[]
  isSelectingRange?: boolean
  selectionBegin?: number
  selectionEnd?: number
  playing?: boolean
  totalTime: number
  currentTime: number
  highlight?: CustomHighlightType
  onTimeChange?: (newTime: number) => void
  onScroll?: (left: number) => void
  onSlide?: () => void
  onRangeUpdate?: (newRange: CommentRange) => void
}

const Waveform = ({
  peaks,
  isSelectingRange,
  selectionBegin,
  selectionEnd,
  playing = false,
  totalTime,
  currentTime,
  highlight,
  onTimeChange,
  onScroll,
  onSlide,
  onRangeUpdate
}: WaveformProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progCanvasRef = useRef<HTMLCanvasElement>(null)

  const [visibleRange, setVisibleRange] = useState<[number, number]>([0, 0])
  const [changedManually, setChangedManually] = useState<boolean>(false)

  const [startBound, setStartBound] = useState<number>(0)
  const [endBound, setEndBound] = useState<number>(0)

  const [currentBound, setCurrentBound] = useState<'left' | 'right'>('left')

  const [movingLeft, setMovingLeft] = useState<boolean>(false)
  const [movingRight, setMovingRight] = useState<boolean>(false)

  const [sliding, setSliding] = useState<boolean>(false)

  const previousWidth = usePrevious(
    Math.ceil(
      (containerRef.current?.scrollWidth || 0) * (currentTime / totalTime)
    )
  )

  useEffect(() => {
    if (
      peaks.length > 0 &&
      canvasRef.current &&
      progCanvasRef.current &&
      containerRef.current
    ) {
      const totalWidth = containerRef.current.scrollWidth * 1.5 // let it be wider!

      const canvas = canvasRef.current
      const progCanvas = progCanvasRef.current

      const ctx = canvas.getContext('2d')
      const progCtx = progCanvas.getContext('2d')

      canvas.width = totalWidth
      progCanvas.width = totalWidth
      canvas.height = 80
      progCanvas.height = 80

      if (ctx && progCtx) {
        ctx.fillStyle = '#fbcfe8'
        progCtx.fillStyle = '#be185d'

        const waveformHeight = 75

        const segmentCount = peaks.length
        const segmentWidth = totalWidth / segmentCount

        peaks.forEach((peak, index) => {
          const xPos = index * segmentWidth
          const segmentHeight = waveformHeight * peak

          const offsetTop = (waveformHeight - segmentHeight) / 2

          ctx.fillRect(xPos, offsetTop, segmentWidth * 1, segmentHeight)
          progCtx.fillRect(xPos, offsetTop, segmentWidth * 1, segmentHeight)
        })
      }

      const scrollLeft = containerRef.current.scrollLeft

      if (containerRef.current.offsetParent) {
        const visibleWidth = containerRef.current.offsetParent?.clientWidth

        const right = scrollLeft + visibleWidth

        console.log('setting visible range to:', scrollLeft, right)

        setVisibleRange([scrollLeft, right])
      }
    }
  }, [peaks, canvasRef, progCanvasRef, containerRef])

  useEffect(() => {
    if (
      progCanvasRef.current &&
      containerRef.current &&
      !(visibleRange[0] === 0 && visibleRange[1] === 0)
    ) {
      if (!changedManually) {
        handleProgressChange(containerRef.current, currentTime, previousWidth)
      } else
        handleProgressChange(
          containerRef.current,
          currentTime,
          previousWidth,
          true
        )

      if (!isSelectingRange) {
        const oneSecondPercentage = 1 / totalTime
        const percentage = currentTime / totalTime
        const width = containerRef.current.scrollWidth

        const newValue = percentage * width

        setStartBound(newValue)
        setEndBound(newValue + 5 * oneSecondPercentage * width)
      }
    }
  }, [currentTime])

  useEffect(() => {
    if (onRangeUpdate && containerRef.current) {
      const width = containerRef.current.scrollWidth

      const startTime = (startBound / width) * totalTime
      const endTime = (endBound / width) * totalTime

      onRangeUpdate({ start: startTime, end: endTime })
    }
  }, [containerRef.current, startBound, endBound])

  function handleProgressChange(
    containerDiv: HTMLDivElement,
    currentTime: number,
    prevWidth: number = 0,
    shouldCenter: boolean = false
  ) {
    const timePercentage = currentTime / totalTime

    if (containerDiv.offsetParent) {
      const newWidth = Math.ceil(containerDiv.scrollWidth * timePercentage)
      const diff = newWidth - prevWidth

      const scrollLeft = containerDiv.scrollLeft

      const visible = containerDiv.offsetParent?.clientWidth

      const leftEdge = newWidth - scrollLeft
      const rightEdge = scrollLeft + visible

      const scrollTreshold = rightEdge - diff

      if (
        newWidth >= scrollTreshold - scrollTreshold * 0.15 &&
        !shouldCenter &&
        !isSelectingRange
      ) {
        containerDiv.scrollBy({ left: diff, behavior: 'instant' })
      } else if (shouldCenter && !isSelectingRange) {
        const scrollValue =
          containerDiv.scrollWidth * timePercentage - visible / 2

        setChangedManually(false)
        containerDiv.scrollLeft = scrollValue
      }

      setVisibleRange([leftEdge, rightEdge])
    }
  }

  function handleWaveformClick(event: React.MouseEvent<HTMLDivElement>) {
    const left = event.currentTarget.getBoundingClientRect().left

    const clickedX = event.currentTarget.scrollLeft + (event.clientX - left)

    const percentage = clickedX / event.currentTarget.scrollWidth

    setChangedManually(true)

    const newTime = totalTime * percentage
    if (onTimeChange) onTimeChange(newTime)
  }

  function handleRangeSelection(
    event: React.MouseEvent<HTMLDivElement>,
    bound: 'left' | 'right'
  ) {
    const boundingRect = event.currentTarget.getBoundingClientRect()
    const clickedX = event.clientX - boundingRect.left

    const scrollLeft = event.currentTarget.scrollLeft
    const relativeClicked = scrollLeft + clickedX

    if (bound === 'left') {
      if (relativeClicked > endBound) {
        setStartBound(endBound)
        setEndBound(relativeClicked)
      } else {
        setStartBound(relativeClicked)
      }
    } else {
      if (relativeClicked <= startBound) {
        setEndBound(startBound)
        setStartBound(relativeClicked)
      } else {
        setEndBound(relativeClicked)
      }
    }
  }

  // function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
  //   if (containerRef.current) {
  //     if (movingLeft || movingRight) {
  //       const boundingRect = containerRef.current.getBoundingClientRect()
  //       const bound =
  //         event.clientX + event.currentTarget.scrollLeft - boundingRect.left

  //       console.log({ bound })

  //       const offsetParent = containerRef.current.offsetParent

  //       if (offsetParent) {
  //         const relativeBoundingRect = offsetParent.getBoundingClientRect()
  //         const relativeBound = event.clientX - relativeBoundingRect.left

  //         console.log({ relativeBound })

  //         const visibleWidth = offsetParent.clientWidth

  //         const leftThreshold = 80
  //         const rightThreshold = visibleWidth - 70

  //         // get position relative to visibleWidth

  //         // if (relativeBound > rightThreshold) {
  //         //   if (onScroll) onScroll(30)
  //         // } else if (relativeBound < leftThreshold) {
  //         //   if (onScroll) onScroll(-30)
  //         // }
  //       }

  //       if (movingLeft) setStartBound(bound)
  //       else if (movingRight) setEndBound(bound)
  //     } else if (sliding) {
  //       handleWaveformClick(event)
  //     }
  //   }
  // }

  return (
    <div
      className={` relative z-[60] ${
        movingLeft || movingRight ? ' overflow-x-hidden' : ' overflow-x-auto'
      } py-2 bg-green-400 transition-all ease-in-out`}
      ref={containerRef}
      onClick={(event) => {
        if (!isSelectingRange) handleWaveformClick(event)
        else {
          handleRangeSelection(event, currentBound)
          setCurrentBound((prev) => (prev === 'left' ? 'right' : 'left'))
        }
      }}
      onPointerDown={() => {
        if (!isSelectingRange) setSliding(true)
      }}
      // onPointerUp={(event) => {
      //   if (sliding) setSliding(false)
      //   else if (isSelectingRange) {
      //     if (movingLeft) setMovingLeft(false)
      //     else if (movingRight) setMovingRight(false)
      //   }
      // }}
      // onPointerMove={(event) => {
      //   console.log('moving')

      //   handleMouseMove(event)
      // }}
    >
      <div className=" flex gap-x-1 fixed text-white bg-neutral-500 bg-opacity-75 z-[100]">
        <span className=" flex justify-center w-10">
          {formatTime(currentTime)}
        </span>
        <span className=" flex justify-center w-2">-</span>
        <span className=" flex justify-center w-10">
          {formatTime(totalTime)}
        </span>
      </div>

      {isSelectingRange && startBound > 0 && (
        <div
          className=" absolute z-[60] h-24 w-full bg-pink-500 bg-opacity-50"
          style={{
            left: `${startBound}px`,
            width: `${endBound - startBound}px`
          }}>
          <div className=" absolute flex justify-center items-center h-24 w-1 bg-pink-800">
            <MarkerButton highlighted={currentBound === 'left'} />
          </div>

          <div
            className=" absolute flex justify-center items-center h-24 w-1 bg-pink-800"
            style={{ right: `0px` }}>
            <MarkerButton
              direction="right"
              highlighted={currentBound === 'right'}
            />
          </div>
        </div>
      )}

      {highlight && (
        <div
          className=" absolute z-[60] h-24 w-full bg-orange-600 bg-opacity-50"
          style={
            highlight && containerRef.current?.scrollWidth
              ? {
                  left: `${
                    (highlight.timeRange.begin / totalTime) *
                    containerRef.current.scrollWidth
                  }px`,
                  width: `${
                    ((highlight.timeRange.end - highlight.timeRange.begin) /
                      totalTime) *
                    containerRef.current.scrollWidth
                  }px`
                }
              : {}
          }
        />
      )}

      <div className=" relative">
        <canvas
          ref={progCanvasRef}
          className=" absolute z-50"
          style={{
            clipPath: `inset(0% ${
              100 - (currentTime === 0 ? 0 : (currentTime / totalTime) * 100)
            }% 0% 0%)`,
            overflow: 'hidden'
          }}
        />
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

export default Waveform
