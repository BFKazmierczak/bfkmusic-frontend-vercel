'use client'

import { gql, useMutation } from '@apollo/client'
import { Bounce, ToastContainer, toast } from 'react-toastify'

const DebugButton = () => {
  // const [throwAnError] = useMutation(THROW_GRAPHQL_ERROR, {})

  return (
    <div>
      <button
        className=" text-pink-600 bg-pink-200"
        onClick={() => console.log('test')}>
        Wywołaj błąd
      </button>
    </div>
  )
}

export default DebugButton
