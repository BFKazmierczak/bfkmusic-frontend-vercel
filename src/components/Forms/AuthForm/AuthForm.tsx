'use client'

import BasicInput from '@/src/components/Inputs/BasicInput/BasicInput'
import { gql, useMutation } from '@apollo/client'
import { CircularProgress } from '@mui/material'
import { error } from 'console'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'

const REGISTER_USER = gql`
  mutation Register(
    $username: String!
    $firstName: String
    $lastName: String
    $email: String!
    $password: String!
  ) {
    userRegister(
      email: $email
      firstName: $firstName
      lastName: $lastName
      password: $password
      username: $username
    ) {
      success
    }
  }
`

interface IFormInput {
  username: string
  firstName: string
  lastName: string
  email: string
  password: string
  retypePassword: string
}

type AuthFormProps =
  | {
      register: true
      login?: never
    }
  | { login: true; register?: never }

const AuthForm = ({ register, login }: AuthFormProps) => {
  const router = useRouter()
  const session = useSession()

  const [loading, setLoading] = useState<boolean>(false)

  const { control, handleSubmit, formState, setError } = useForm({
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      retypePassword: ''
    }
    // mode: 'onChange'
    // reValidateMode: 'onChange'
  })

  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      router.push('/login?registered=true')
    }
  })

  const onSubmit: SubmitHandler<IFormInput> = async (data, event) => {
    event?.preventDefault()

    if (loading) return

    setLoading(true)

    if (register) {
      registerUser({
        variables: {
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password
        }
      })
    } else if (login) {
      try {
        const result = await signIn('cred', {
          username: data.username,
          password: data.password,
          callbackUrl: 'http://localhost:3000/',
          redirect: false
        })

        if (result?.error) {
          toast(result.error, { theme: 'colored', type: 'error' })
          setError('username', {
            type: 'server',
            message: 'Nie udało się zalogować.'
          })
          setLoading(false)
        }

        if (result?.ok && result.url) {
          router.push('/')
          router.refresh()
        }
      } catch (error) {
        console.log('catched an error')
      }
    }
  }

  return (
    <>
      <p className=" mb-5 text-center font-bold text-xl">
        {register && 'Rejestracja'} {login && 'Logowanie'}
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" flex flex-col gap-y-2">
          <Controller
            name="username"
            control={control}
            rules={{ required: 'Uzupełnij nazwę użytkownika' }}
            render={({ field }) => (
              <>
                {formState.errors.username && (
                  <p className=" text-pink-600">
                    {formState.errors.username.message}
                  </p>
                )}
                <BasicInput
                  {...field}
                  placeholder={
                    (register && 'Nazwa użytkownika') ||
                    (login && 'Nazwa użytkownika lub e-mail')
                  }
                  error={formState.errors.username !== undefined}
                />
              </>
            )}
          />

          {register && (
            <div className=" flex gap-x-2">
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <>
                    {formState.errors.firstName && (
                      <p className=" text-pink-600">
                        {formState.errors.firstName.message}
                      </p>
                    )}
                    <BasicInput
                      {...field}
                      placeholder="Imię"
                      error={formState.errors.firstName !== undefined}
                    />
                  </>
                )}
              />

              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <>
                    {formState.errors.lastName && (
                      <p className=" text-pink-600">
                        {formState.errors.lastName.message}
                      </p>
                    )}
                    <BasicInput
                      {...field}
                      placeholder="Nazwisko"
                      error={formState.errors.lastName !== undefined}
                    />
                  </>
                )}
              />
            </div>
          )}

          {register && (
            <Controller
              name="email"
              control={control}
              rules={{ required: 'Uzupełnij adres e-mail' }}
              render={({ field }) => (
                <>
                  {formState.errors.email && (
                    <p className=" text-pink-600">
                      {formState.errors.email.message}
                    </p>
                  )}
                  <BasicInput
                    {...field}
                    placeholder="E-mail"
                    error={formState.errors.email !== undefined}
                  />
                </>
              )}
            />
          )}

          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Uzupełnij hasło',
              minLength: register && {
                value: 12,
                message: 'Hasło musi mieć co najmniej 12 znaków.'
              }
            }}
            render={({ field }) => (
              <div className=" ">
                {formState.errors.password && (
                  <p className=" text-pink-600">
                    {formState.errors.password.message}
                  </p>
                )}
                <BasicInput
                  {...field}
                  placeholder="Hasło"
                  error={formState.errors.password !== undefined}
                  type="password"
                />
              </div>
            )}
          />

          {register && (
            <Controller
              name="retypePassword"
              control={control}
              rules={{
                required: 'Powtórz hasło',
                validate: (value, formValues) => {
                  return (
                    value === formValues.password || 'Hasła nie pokrywają się.'
                  )
                }
              }}
              render={({ field }) => (
                <>
                  {formState.errors.retypePassword && (
                    <p className=" text-pink-600">
                      {formState.errors.retypePassword.message}
                    </p>
                  )}
                  <BasicInput
                    {...field}
                    placeholder="Powtórz hasło"
                    error={formState.errors.retypePassword !== undefined}
                    type="password"
                  />
                </>
              )}
            />
          )}

          <button
            className=" mt-5 basic-button w-full"
            disabled={loading}
            type="submit">
            {register && 'Załóż konto'}
            {login && !loading && 'Zaloguj'}
            {login && loading && (
              <span className=" flex justify-center">
                <CircularProgress size={24} style={{ color: 'white' }} />
              </span>
            )}
          </button>
        </div>
      </form>

      {login && (
        <p className=" mt-2 text-center">
          Nie posiadasz jeszcze konta?{' '}
          <Link
            className=" text-pink-600 active:text-pink-700e"
            href="/register">
            Zarejestruj się
          </Link>
        </p>
      )}

      {register && (
        <p className=" mt-2 text-center">
          Masz już konto?{' '}
          <Link className=" text-pink-600 active:text-pink-700e" href="/login">
            Zaloguj się
          </Link>
        </p>
      )}
    </>
  )
}

export default AuthForm
