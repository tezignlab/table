import { getUser, signIn, signUp, updateUser, updatePassword } from '@/services/auth'
import { useQuery } from 'react-query'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { ACCESS_TOKEN_NAME } from '../constants/index'
import { authStatusState, authUserState } from '../stores/auth'
import { sagaErrorCodeHandler, sagaErrorStatusHandler } from '../utils/error'

export const useSignIn = (params: Parameters<typeof signIn>[number]) => {
  const [authStatus, setAuthStatus] = useRecoilState(authStatusState)
  const setAuthUser = useSetRecoilState(authUserState)

  return useQuery<null, Error>(
    ['signIn', { params }],
    async () => {
      try {
        let result: { code?: number; token_type: string; access_token: string }
        result = await signIn(params)

        if (!result.access_token) throw { reponse: { status: 401 }, data: result }

        localStorage.setItem(ACCESS_TOKEN_NAME, result.access_token)
      } catch (error) {
        setAuthStatus({
          ...authStatus,
          error: true,
          message: sagaErrorStatusHandler(error),
        })

        return null // no need to `getUser`
      }

      try {
        const result = await getUser()

        if (result.code === 0) {
          setAuthUser(result.data)
        }
      } catch (error) {
        //
      }

      return null
    },
    { enabled: false }, // query must be triggered manually by `refetch`
  )
}

export const useSignUp = (params: Parameters<typeof signUp>[number]) => {
  const [authStatus, setAuthStatus] = useRecoilState(authStatusState)
  const setAuthUser = useSetRecoilState(authUserState)
  return useQuery<null, Error>(
    ['signUp', { params }],
    async () => {
      try {
        const result = await signUp(params)
        console.log('signUp', result)
        if ('access_token' in result.data) {
          localStorage.setItem(ACCESS_TOKEN_NAME, result.data.access_token)
        } else {
          setAuthStatus({
            ...authStatus,
            error: true,
            message: sagaErrorCodeHandler(result.code.toString()),
          })
        }
      } catch (error) {
        setAuthStatus({
          ...authStatus,
          error: true,
          message: sagaErrorStatusHandler(error),
        })
      }
      try {
        const result = await getUser()

        if (result.code === 0) {
          setAuthUser(result.data)
        }
      } catch (error) {
        //
      }

      return null
    },
    {
      enabled: false, // query must be triggered manually by `refetch`
    },
  )
}

export const useGetUser = () => {
  const setAuthUser = useSetRecoilState(authUserState)
  const [authStatus, setAuthStatus] = useRecoilState(authStatusState)

  return useQuery<null, Error>(
    'getUser',
    async () => {
      try {
        const result = await getUser()

        if (result.code === 0) {
          setAuthUser(result.data)
        }
      } catch (error) {
        //
      } finally {
        setAuthStatus({ ...authStatus, requested: true })
      }

      return null
    },
    {
      cacheTime: 0, // not cache getUser api
    },
  )
}

export const useUpdateUser = (params: Parameters<typeof updateUser>[number]) => {
  const setAuthUser = useSetRecoilState(authUserState)
  const [authStatus, setAuthStatus] = useRecoilState(authStatusState)

  return useQuery<null, Error>(
    ['updateUser', { params }],
    async () => {
      try {
        const result = await updateUser(params)

        if (result && result.code === 0) {
          setAuthStatus({
            ...authStatus,
            success: true,
            message: 'account.success',
          })
        }
      } catch (error) {
        setAuthStatus({
          ...authStatus,
          error: true,
          message: sagaErrorStatusHandler(error),
        })

        return null
      }

      try {
        const result = await getUser()

        if (result.code === 0) {
          setAuthUser(result.data)
        }
      } catch (error) {
        //
      }

      return null
    },
    { enabled: false },
  )
}

export const useUpdatePassword = (params: Parameters<typeof updatePassword>[number]) => {
  const [authStatus, setAuthStatus] = useRecoilState(authStatusState)

  return useQuery<null, Error>(
    ['updatePassword', params],
    async () => {
      try {
        const result = await updatePassword(params)

        if (result.code === 0) {
          setAuthStatus({
            ...authStatus,
            success: true,
            message: 'account.password.success',
          })
        } else {
          setAuthStatus({
            ...authStatus,
            error: true,
            message: sagaErrorCodeHandler(result.code.toString()),
          })
        }
      } catch (error) {
        setAuthStatus({
          ...authStatus,
          error: true,
          message: sagaErrorStatusHandler(error),
        })
      }

      return null
    },
    {
      enabled: false, // query must be triggered manually by `refetch`
    },
  )
}
