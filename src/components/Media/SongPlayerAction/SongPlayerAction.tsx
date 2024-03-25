import { useEffect, useRef, useState } from 'react'

import IconButton from '../../Buttons/IconButton'
import SongPlayer, { SongPlayerProps } from '../SongPlayer/SongPlayer'

import AddCommentIcon from '@mui/icons-material/AddComment'
import CommentBox from '../../CommentBox/CommentBox'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'

import useHighlightStore from '../../../stores/highlightStore'
import { Modal } from '@mui/material'
import { useSession } from 'next-auth/react'
import { gql, useMutation } from '@apollo/client'
import { CommentEntity, UploadFileEntity } from '@/src/gql/graphql'
import { graphql } from '@/src/gql'
import Waveform from '../Waveform/Waveform'
import useGlobalPlayerStore from '@/src/stores/globalPlayerStore'
import formatTime from '@/src/utils/formatTime'
import getTimeRangeNumberArray from '@/src/utils/getTimeRangeNumberArray'

const CREATE_SONG_COMMENT = graphql(`
  mutation CreateComment(
    $content: String!
    $songId: Int!
    $fileId: Int!
    $timeRange: TimeRange!
  ) {
    createComment(
      data: {
        content: $content
        songId: $songId
        fileId: $fileId
        timeRange: $timeRange
      }
    ) {
      data {
        id
        attributes {
          content
          fileId
          timeRange
          user {
            data {
              id
              attributes {
                username
              }
            }
          }
        }
      }
    }
  }
`)

const GENERATE_WAVEFORM = graphql(`
  mutation GenerateWaveform($fileId: Int!) {
    calculateFileDuration(fileId: $fileId) {
      data {
        id
        attributes {
          createdAt
          updatedAt
          name
          url
          duration
          waveform {
            data {
              id
              attributes {
                peaks
              }
            }
          }
        }
      }
    }
  }
`)

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

  const [generateWaveform] = useMutation(GENERATE_WAVEFORM, {
    onCompleted: (data) => {
      console.log({ data })
    }
  })

  const [comments, setComments] = useState<CommentEntity[]>(() => {
    const data = props.song.attributes?.comments?.data
    if (data) return data
    else return []
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

  const peaks =
    props.song.attributes?.audio?.data[audioIndex].attributes?.waveform?.data
      ?.attributes?.peaks

  const file = props.song.attributes?.audio?.data[
    audioIndex
  ] as UploadFileEntity

  const duration = props.song.attributes?.audio?.data[audioIndex].attributes
    ?.duration as number

  const [createComment] = useMutation(CREATE_SONG_COMMENT, {
    onCompleted: (data) => {
      const newComment = data.createComment?.data

      if (newComment) {
        setComments((prev) => {
          if (prev.length === 0) return [newComment as CommentEntity]
          else return [newComment as CommentEntity, ...prev]
        })

        setAddingComment(false)
      }
    }
  })

  useEffect(() => {
    if (comments) {
      commentContainerRef.current?.scrollTo({ top: 0 })
    }
  }, [comments])

  useEffect(() => {
    console.log('Highlight effect:', highlight)
  }, [highlight])

  function handleCreateComment(event: React.MouseEvent<HTMLButtonElement>) {
    const songId = props.song.id as string
    const fileId = props.song.attributes?.audio?.data[audioIndex].id

    createComment({
      variables: {
        content: commentValue,
        songId: Number(songId),
        fileId: Number(fileId),
        timeRange: {
          from: Math.round(commentRange.start),
          to: Math.round(commentRange.end)
        }
      }
    })
  }

  return (
    <>
      <SongPlayer {...props} audioIndex={audioIndex}>
        <div className=" flex flex-col gap-y-1">
          <IconButton
            icon={<AddCommentIcon />}
            onClick={() => {
              setModalOpen(true)
            }}
          />

          {admin && props.song.attributes?.audio?.data[audioIndex]?.id && (
            <button
              className=" small-button"
              onClick={() => {
                generateWaveform({
                  variables: {
                    fileId: Number(
                      props.song.attributes?.audio?.data[audioIndex].id
                    )
                  }
                })
              }}>
              Wygeneruj przebieg
            </button>
          )}
        </div>
      </SongPlayer>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setHighlight(undefined)
        }}>
        <>
          <div
            className={` lg:flex lg:gap-x-5 absolute inset-5 p-5 bg-white border-2 border-gray-500 shadow-xl ${
              modalOpen ? 'bg-opacity-100' : 'bg-opacity-0'
            } overflow-y-auto transition-all ease-in-out`}>
            <div className=" flex flex-col lg:w-[50%]">
              {peaks && (
                <div className=" relative w-full" ref={waveformContainerRef}>
                  <Waveform
                    totalTime={duration}
                    currentTime={currentTime}
                    highlight={highlight}
                    peaks={peaks}
                    isSelectingRange={rangeSelection}
                    onTimeChange={changeTime}
                    onScroll={(left) => {
                      if (waveformContainerRef.current) {
                        waveformContainerRef.current.scrollBy({
                          left,
                          behavior: 'smooth'
                        })
                      }
                    }}
                    onRangeUpdate={(newRange) => {
                      console.log('on range update!', { newRange })
                      setCommentRange(newRange)
                    }}
                  />
                </div>
              )}

              <SongPlayer {...props} size="small" />
              <div className=" flex flex-col mt-5">
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
                    <textarea
                      className=" basic-input w-full resize-none"
                      rows={2}
                      placeholder="Napisz komentarz..."
                      value={commentValue}
                      onChange={(event) => setCommentValue(event.target.value)}
                    />
                    <div className=" flex flex-col gap-y-1">
                      <span
                        className=" flex justify-center items-center z-[40] px-1 gap-x-1 text-white bg-pink-500 cursor-pointer"
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
            </div>

            <div className=" flex flex-col gap-y-2 lg:w-[50%]">
              <span className=" font-bold text-lg">Dyskusja</span>

              <div className=" flex justify-center">
                <div
                  className=" relative flex flex-col sm:items-center gap-y-5 w-full h-[50vh] overflow-y-auto"
                  ref={commentContainerRef}
                  onScroll={(event) => {
                    const eTarget = event.target as HTMLElement

                    setScrolLPosition(eTarget.scrollTop)
                  }}>
                  {commentContainerRef.current &&
                    comments.length > 1 &&
                    commentContainerRef.current?.scrollTop > 0 && (
                      <div className=" sticky flex justify-center items-center top-0 w-full bg-neutral-100 text-neutral-500 shadow-xl">
                        <ArrowDropUpIcon style={{ fontSize: '1rem' }} />
                      </div>
                    )}

                  {comments
                    .toSorted((a, b) => {
                      if (a.attributes?.createdAt > b.attributes?.createdAt)
                        return -1
                      else if (
                        a.attributes?.createdAt < b.attributes?.createdAt
                      )
                        return 1
                      else return 0
                    })
                    .map((comment, index) => {
                      return (
                        <CommentBox
                          key={comment.id}
                          data={comment}
                          userId={session.data?.user?.id}
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
                    comments.length > 1 &&
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
