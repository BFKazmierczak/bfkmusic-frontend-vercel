import { onError } from '@apollo/client/link/error'
import {
  isRedirectError,
  RedirectType
} from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'

const EXPIRED_ERROR =
  'sequence item 0: expected str instance, ExpiredSignatureError found'

const serverErrorLink = onError(({ graphQLErrors, networkError }) => {
  console.log('serverlink')
  if (graphQLErrors) {
    console.log('graphqlerrors')
    if (graphQLErrors.some((error) => error.message === EXPIRED_ERROR)) {
      console.log('expired signature ERROR')

      try {
        redirect('/login', RedirectType.push)
      } catch (error) {
        if (isRedirectError(error)) console.log('redirect error')
      }
    } else {
      const messages = graphQLErrors.map(
        ({ message, locations, path }) => message
      )
      console.log({ messages })
    }
  }

  if (networkError) {
    console.log('networkError')
  }
})

export default serverErrorLink
