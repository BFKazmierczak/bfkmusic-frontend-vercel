import { onError } from '@apollo/client/link/error'
import { ToastContainer, toast } from 'react-toastify'

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    const messages = graphQLErrors.map(
      ({ message, locations, path }) => message
    )

    console.log({ messages })

    toast(messages.join(','))
  }

  if (networkError) console.error(`[Network error]: ${networkError}`)
})

export default errorLink
