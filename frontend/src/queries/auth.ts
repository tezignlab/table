import {
  activateUser,
  getUser,
  getVerificationCode,
  signIn,
  signUp,
  signInWithCode,
} from '@/services/auth'
import { authStatusState, authUserState } from '../stores/auth'
import { ACCESS_TOKEN_NAME, VERIFICATION_CODE_TIME_NAME } from '../constants/index'
import { sagaErrorStatusHandler,sagaErrorCodeHandler } from '../../utils/error'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useRecoilState, useSetRecoilState } from 'recoil'

export const useSignIn = (params: Parameters<typeof signIn>[number] | Parameters<typeof signInWithCode>[number]) => {
  const [authStatus, setAuthStatus] = useRecoilState(authStatusState)
  const setAuthUser = useSetRecoilState(authUserState)

  return useQuery<null, Error>(
    ['signIn', { params }],
    async () => {
      try {
        let result: { code?: number; token_type: string; access_token: string }
        if ('phone' in params) {
          result = await signInWithCode(params)
        } else {
          result = await signIn(params)
        }

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
        if ('access_token' in result) {
          localStorage.setItem(ACCESS_TOKEN_NAME, result.access_token)
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
