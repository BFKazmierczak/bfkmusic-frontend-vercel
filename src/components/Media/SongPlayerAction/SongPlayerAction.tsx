import { useEffect, useRef, useState } from 'react'

import IconButton from '../../Buttons/IconButton'
import SongPlayer, { SongPlayerProps } from '../SongPlayer/SongPlayer'

import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import CommentBox from '../../CommentBox/CommentBox'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'

import useHighlightStore from '../../../stores/highlightStore'
import { Modal } from '@mui/material'
import { useSession } from 'next-auth/react'
import { gql, useMutation } from '@apollo/client'
import { AudioType, CommentType } from '@/src/gql/graphql'
import { graphql } from '@/src/gql'
import Waveform from '../Waveform/Waveform'
import useGlobalPlayerStore from '@/src/stores/globalPlayerStore'
import formatTime from '@/src/utils/formatTime'
import getTimeRangeNumberArray from '@/src/utils/getTimeRangeNumberArray'
import { usePathname, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

const CREATE_COMMENT = graphql(`
  mutation CreateComment(
    $songId: ID!
    $audioId: ID!
    $content: String!
    $startTime: Int!
    $endTime: Int!
  ) {
    commentCreate(
      songId: $songId
      audioId: $audioId
      content: $content
      startTime: $startTime
      endTime: $endTime
    ) {
      comment {
        id
        createdAt
        updatedAt
        content
        startTime
        endTime
        user {
          id
          username
        }
      }
    }
  }
`)

// const GENERATE_WAVEFORM = graphql(`
//   mutation GenerateWaveform($fileId: Int!) {
//     calculateFileDuration(fileId: $fileId) {
//       data {
//         id
//         attributes {
//           createdAt
//           updatedAt
//           name
//           url
//           duration
//           waveform {
//             data {
//               id
//               attributes {
//                 peaks
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `)

export interface CommentRange {
  start: number
  end: number
}

interface SongPlayerActionProps extends SongPlayerProps {
  admin?: boolean
}

const SongPlayerAction = ({
  audioIndex = 0,
  admin = false,
  ...props
}: SongPlayerActionProps) => {
  const session = useSession()
  const pathname = usePathname()
  const queryParams = useSearchParams()

  const showDetails = queryParams?.get('showDetails')

  const {
    songData,
    pause,
    playing,
    playSong,
    changeTime,
    currentTime,
    source
  } = useGlobalPlayerStore()

  const { highlight, setHighlight } = useHighlightStore()

  const commentContainerRef = useRef<HTMLDivElement>(null)
  const waveformContainerRef = useRef<HTMLDivElement>(null)

  // const [generateWaveform] = useMutation(GENERATE_WAVEFORM, {
  //   onCompleted: (data) => {
  //     console.log({ data })
  //   }
  // })

  const [comments, setComments] = useState<CommentType[]>(() => {
    const data = props.song.audioFiles[audioIndex]?.comments
    if (data) return data
    return []
  })

  const [addingComment, setAddingComment] = useState<boolean>(false)

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedComment, setSelectedComment] = useState<string>()

  const [commentValue, setCommentValue] = useState<string>('')

  const [scrollPosition, setScrolLPosition] = useState<number>(0)

  const [rangeSelection, setRangeSelection] = useState<boolean>(false)

  const [commentRange, setCommentRange] = useState<CommentRange>({
    start: 0,
    end: 0
  })

  const [peaks] = useState(() => {
    const waveformString = props.song.audioFiles[audioIndex]?.waveform
    return waveformString
      .substring(2, waveformString.length - 2)
      .split(',')
      .map(Number)
  })

  const [duration] = useState(() => props.song.audioFiles[audioIndex]?.duration)
  const [createComment] = useMutation(CREATE_COMMENT, {
    onCompleted: (data) => {
      const newComment = data.commentCreate?.comment

      if (newComment) {
        setComments((prev) => {
          if (prev.length === 0) return [newComment as CommentType]
          else return [newComment as CommentType, ...prev]
        })

        toast('Dodano komentarz', {
          theme: 'colored',
          type: 'success',
          autoClose: 1000
        })

        setAddingComment(false)
        setCommentValue('')
        setCommentRange({
          start: 0,
          end: 0
        })
      }
    }
  })

  useEffect(() => {
    if (comments) {
      commentContainerRef.current?.scrollTo({ top: 0 })
    }
  }, [comments])

  useEffect(() => {
    if (addingComment) setHighlight(undefined)
    else {
      setCommentValue('')
      setCommentRange({
        start: 0,
        end: 0
      })
    }
  }, [addingComment])

  useEffect(() => {
    if (showDetails) {
      const castedParam = Number(showDetails)
      if (
        castedParam !== undefined &&
        !isNaN(castedParam) &&
        castedParam >= 0
      ) {
        setModalOpen(true)
        setComments(props.song?.audioFiles[castedParam]?.comments)
      } else setModalOpen(false)
    } else {
      setModalOpen(false)
      setComments([])
    }
  }, [showDetails])

  function handleCreateComment(event: React.MouseEvent<HTMLButtonElement>) {
    const songId = props.song.id as string
    const audioId = props.song.audioFiles[showDetails].id

    createComment({
      variables: {
        content: commentValue,
        songId,
        audioId,
        startTime: Math.round(commentRange.start),
        endTime: Math.round(commentRange.end)
      }
    })
  }

  return (
    <>
      <SongPlayer {...props} audioIndex={audioIndex}>
        {props.song.inLibrary && (
          <div className=" flex flex-col gap-y-1 text-sm">
            <IconButton
              icon={<MoreHorizIcon />}
              onClick={() => {
                setModalOpen(true)
                window.history.pushState(
                  {
                    showDetails: audioIndex
                  },
                  '',
                  `${pathname}?showDetails=${audioIndex}`
                )
              }}>
              Więcej
            </IconButton>
          </div>
        )}
      </SongPlayer>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setHighlight(undefined)

          window.history.replaceState(
            {
              showDetails: undefined
            },
            '',
            pathname
          )
        }}>
        <>
          <div
            className={` lg:flex lg:gap-x-5 absolute inset-5 p-3 bg-white border-2 border-gray-500 shadow-xl ${
              modalOpen ? 'bg-opacity-100' : 'bg-opacity-0'
            } overflow-y-auto transition-all ease-in-out`}>
            <div className=" flex flex-col lg:w-[50%]">
              {peaks && (
                <div className=" relative w-full" ref={waveformContainerRef}>
                  <Waveform
                    totalTime={duration as number}
                    currentTime={currentTime}
                    highlight={highlight}
                    peaks={peaks}
                    isSelectingRange={rangeSelection}
                    onTimeChange={changeTime}
                    // onScroll={(left) => {
                    //   if (waveformContainerRef.current) {
                    //     waveformContainerRef.current.scrollBy({
                    //       left,
                    //       behavior: 'smooth'
                    //     })
                    //   }
                    // }}
                    onRangeUpdate={(newRange) => {
                      setCommentRange(newRange)
                    }}
                  />
                </div>
              )}

              <SongPlayer
                {...props}
                audioIndex={Number(showDetails)}
                size="small"
              />
              <div className=" flex flex-col gap-y-3 mt-5">
                <div
                  className=" relative flex justify-center bg-pink-600 font-bold text-white py-1 select-none"
                  onClick={() => setAddingComment((prev) => !prev)}>
                  {addingComment && <span> Anuluj dodawanie</span>}
                  {!addingComment && <span>Dodaj komentarz</span>}
                </div>
                <div
                  className=" shadow-lg 
                    overflow-hidden duration-500"
                  style={
                    addingComment
                      ? {
                          maxHeight: '13rem',
                          transition: 'max-height 0.35s ease-out'
                        }
                      : {
                          maxHeight: '0rem',
                          transition: 'max-height 0.35s ease-in'
                        }
                  }>
                  <div className=" flex flex-col sm:flex-row sm:gap-x-5 gap-y-2 w-full p-3 bg-neutral-100">
                    <div className=" flex flex-col gap-y-1">
                      <span
                        className=" flex justify-center items-center z-[40] px-1 gap-x-1 text-white bg-pink-400 cursor-pointer"
                        onClick={() => {
                          setRangeSelection((prev) => !prev)
                        }}>
                        {rangeSelection ? (
                          'Zatwierdź zakres'
                        ) : (
                          <>
                            <SettingsEthernetIcon /> Wyznacz zakres
                          </>
                        )}
                      </span>

                      <div className=" flex gap-x-1 justify-between z-[40] bg-white">
                        <span className=" flex z-[40]">
                          Od: {formatTime(commentRange.start)}
                        </span>

                        <span className=" flex z-[40]">
                          Do: {formatTime(commentRange.end)}
                        </span>
                      </div>
                    </div>

                    <textarea
                      className=" basic-input w-full resize-none"
                      rows={2}
                      placeholder="Napisz komentarz..."
                      value={commentValue}
                      onChange={(event) => setCommentValue(event.target.value)}
                    />

                    <button
                      className=" basic-button"
                      disabled={commentValue.length === 0}
                      onClick={handleCreateComment}>
                      Dodaj komentarz
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className=" flex flex-col gap-y-2 lg:w-[50%]">
              <div>
                <span className=" text-md">Dyskusja</span>
                <div className=" flex w-full bg-black h-[2px]" />
              </div>

              <div className=" flex justify-center">
                <div
                  className=" relative flex flex-col sm:items-center gap-y-5 w-full h-[50vh] overflow-y-auto"
                  ref={commentContainerRef}
                  onScroll={(event) => {
                    const eTarget = event.target as HTMLElement

                    setScrolLPosition(eTarget.scrollTop)
                  }}>
                  {commentContainerRef.current &&
                    comments?.length > 1 &&
                    commentContainerRef.current?.scrollTop > 0 && (
                      <div className=" sticky flex justify-center items-center top-0 w-full bg-neutral-100 text-neutral-500 shadow-xl">
                        <ArrowDropUpIcon style={{ fontSize: '1rem' }} />
                      </div>
                    )}

                  {comments
                    ?.toSorted((a, b) => {
                      if (a.createdAt > b.createdAt) return -1
                      else if (a.createdAt < b.createdAt) return 1
                      else return 0
                    })
                    .map((comment, index) => {
                      return (
                        <CommentBox
                          key={comment.id}
                          data={comment}
                          userId={session.data?.token.user.id}
                          selected={comment.id === selectedComment}
                          onSelect={(id, timeRange) => {
                            console.log({ timeRange })

                            const arr = timeRange.split(':')

                            if (arr.length === 2) {
                              const newArr = arr.map((value) => Number(value))

                              if (!isNaN(newArr[0]) && !isNaN(newArr[1])) {
                                setHighlight({
                                  timeRange: {
                                    begin: Math.round(newArr[0]),
                                    end: Math.round(newArr[1])
                                  },
                                  fileId: Number(id)
                                })
                              } else setHighlight(undefined)
                            } else setHighlight(undefined)

                            setSelectedComment(id)
                          }}
                        />
                      )
                    })}

                  {commentContainerRef.current &&
                    comments?.length > 1 &&
                    commentContainerRef.current?.scrollTop !==
                      commentContainerRef.current.scrollHeight -
                        commentContainerRef.current.clientHeight && (
                      <div className=" sticky flex justify-center items-center bottom-0 w-full bg-neutral-100 text-neutral-500">
                        <ArrowDropDownIcon style={{ fontSize: '1rem' }} />
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
          <div
            className={` ${
              rangeSelection ? 'visible' : 'hidden'
            } fixed inset-0 z-[30] bg-black bg-opacity-75 w-full h-full`}
          />
        </>
      </Modal>
    </>
  )
}

export default SongPlayerAction
