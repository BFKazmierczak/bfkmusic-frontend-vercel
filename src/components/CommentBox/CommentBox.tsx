import { CommentType } from '@/src/gql/graphql'
import formatTimeRange from '@/src/utils/formatTimeRange'
import moment from 'moment'
import 'moment/locale/pl'

import VisibilityIcon from '@mui/icons-material/Visibility'
import { useRef } from 'react'

interface CommentBoxProps {
  data: CommentType
  userId?: number
  selected: boolean
  onSelect?: (id: string, timeRange: string) => void
}

const CommentBox = ({ data, userId, selected, onSelect }: CommentBoxProps) => {
  const commentRef = useRef<HTMLDivElement>(null)

  const formattedDate = moment(data.createdAt).format('LLL')

  return (
    <div
      className={` flex flex-col gap-y-1 shadow-md p-3
        w-full ${Number(userId) === Number(data.user.id) && 'bg-pink-100'} ${
        selected && ' outline -outline-offset-2 outline-pink-700'
      } cursor-pointer`}
      ref={commentRef}
      onClick={() => {
        if (commentRef.current) {
          commentRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }

        if (!selected && onSelect && data.id) {
          onSelect(data.id, `${data.startTime}:${data.endTime}`)
        }
      }}>
      <div className=" flex flex-row items-end justify-between border-b-2 border-neutral-300">
        <span className=" font-bold text-lg text-pink-700">
          {data?.user?.username}
        </span>

        <span className=" hidden sm:inline text-neutral-500">
          Dodano {formattedDate}
        </span>
      </div>

      <span className=" flex flex-row items-center text-neutral-500">
        Zakres czasu:{'   '}
        <span className=" font-bold">
          {formatTimeRange(`${data.startTime}:${data.endTime}`)}
        </span>
        <VisibilityIcon className=" ml-1 hover:text-neutral-600 cursor-pointer" />
      </span>

      <span>{data.content}</span>

      <span className=" sm:hidden text-neutral-500">
        Dodano {formattedDate}
      </span>
    </div>
  )
}

export default CommentBox
