import { onError } from '@apollo/client/link/error'
import { signOut } from 'next-auth/react'
import { toast } from 'react-toastify'

const EXPIRED_ERROR =
  'sequence item 0: expected str instance, ExpiredSignatureError found'

const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.log('error link')
  console.log('checking')
  if (toast) {
    if (graphQLErrors) {
      console.log('graphqlerrors')
      if (graphQLErrors.some((error) => error.message === EXPIRED_ERROR)) {
        console.log('client: expired signature')

        toast(<span>Twoja sesja wygasła. Zaloguj się ponownie</span>, {
          type: 'error',
          theme: 'colored',
          autoClose: false
        })

        setTimeout(() => {
          signOut({ redirect: true, callbackUrl: '/login?expired=true' })
        }, 1500)
      } else {
        const messages = graphQLErrors.map(
          ({ message, locations, path }) => message
        )
        toast(messages.join(','), { type: 'error', theme: 'colored' })
      }
    }

    if (networkError) {
      console.log('networkError')
      toast(networkError.message, { type: 'error', theme: 'colored' })
    }
  }
})

export default errorLink
