import { onError } from '@apollo/client/link/error'
import { toast } from 'react-toastify'

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    const messages = graphQLErrors.map(
      ({ message, locations, path }) => message
    )

    toast(messages.join(','), { type: 'error', theme: 'colored' })
  }

  if (networkError)
    toast(networkError.message, { type: 'error', theme: 'colored' })
})

export default errorLink
