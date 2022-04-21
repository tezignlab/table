// import { Effect, Reducer } from 'umi'
import {
  signIn as signInService,
  signUp as signUpService,
  getUser as getUserService,
  activateUser as activateUserService,
  getVerificationCode as getVerificationCodeService,
  signInWithCode as signInWithCodeService,
  updateUser as updateUserService,
  updatePassword as updatePasswordService,
} from '../services/auth'
import { ACCESS_TOKEN_NAME, VERIFICATION_CODE_TIME_NAME } from '../constants'
import { sagaErrorStatusHandler, sagaErrorCodeHandler } from '../utils/error'

export interface User {
  id: string
  username: string
  nickname: string
  email?: string
  avatar: string
  location?: string
  bio?: string
}

export interface AuthModelState {
  user?: User
  verificationCodeRequesting?: boolean
  error?: boolean
  message?: string
  success?: boolean
  requested?: boolean
}

export interface AuthModelType {
  namespace: 'auth'
  state: AuthModelState
  effects: {
    signIn: Effect
    signUp: Effect
    getVerificationCode: Effect
    signOut: Effect
    activateUser: Effect
    getUser: Effect
    updateUser: Effect
    updatePassword: Effect
  }
  reducers: {
    save: Reducer<AuthModelState>
    saveUser: Reducer<AuthModelState>
    clearNotification: Reducer<AuthModelState>
  }
  // subscriptions: { setup: Subscription }
}

const initialState: AuthModelState = {
  user: undefined,
  verificationCodeRequesting: false,
  error: false,
  message: undefined,
  success: false,
  requested: false,
}

const AuthModel: AuthModelType = {
  namespace: 'auth',

  state: initialState,

  effects: {
    *signIn({ payload }, { put }) {
      // const { username, password } = payload
      const { type } = payload

      try {
        let result
        if (type === 'email' || type === 'username') {
          const { username, password } = payload
          result = yield signInService(username, password)
        } else if (type === 'phone') {
          const { phone, code } = payload
          result = yield signInWithCodeService(phone, code)
        }

        const { access_token } = result
        localStorage.setItem(ACCESS_TOKEN_NAME, access_token)

        // get user data after setting access token
        yield put({ type: 'getUser' })
      } catch (error: any) {
        yield put({
          type: 'save',
          payload: {
            error: true,
            message: sagaErrorStatusHandler(error),
          },
        })
      }
    },

    *signUp({ payload }, { put }) {
      const { username, password, email } = payload

      try {
        const result = yield signUpService(username, password, email)

        const { code } = result
        if (code === 0) {
          yield put({
            type: 'save',
            payload: { success: true },
          })
        } else {
          yield put({
            type: 'save',
            payload: {
              error: true,
              message: sagaErrorCodeHandler(code),
            },
          })
        }
      } catch (error: any) {
        yield put({
          type: 'save',
          payload: {
            error: true,
            message: sagaErrorStatusHandler(error),
          },
        })
      }
    },

    *getVerificationCode({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          verificationCodeRequesting: true,
        },
      })

      const { phone } = payload

      try {
        const result = yield getVerificationCodeService(phone)

        if (result && result.code === 0) {
          const currentTime = new Date()
          currentTime.setSeconds(currentTime.getSeconds() + 60)
          localStorage.setItem(
            VERIFICATION_CODE_TIME_NAME,
            currentTime.getTime().toString(),
          )
          yield put({
            type: 'save',
            payload: {
              success: true,
              verificationCodeRequesting: false,
              message: 'auth.verificationCode.success',
            },
          })
        }
      } catch (error) {
        yield put({
          type: 'save',
          payload: {
            error: true,
            message: sagaErrorStatusHandler(error),
            verificationCodeRequesting: false,
          },
        })
      }
    },

    *activateUser({ payload }, { put }) {
      const { activateCode } = payload

      try {
        const result = yield activateUserService(activateCode)

        const { code } = result
        if (code === 0) {
          const { access_token } = result.data
          localStorage.setItem(ACCESS_TOKEN_NAME, access_token)

          yield put({
            type: 'save',
            payload: { success: true },
          })
          yield put({
            type: 'getUser',
          })
        } else {
          yield put({
            type: 'save',
            payload: {
              error: true,
              message: sagaErrorCodeHandler(code),
            },
          })
        }
      } catch (error: any) {
        yield put({
          type: 'save',
          payload: {
            error: true,
            message: sagaErrorStatusHandler(error),
          },
        })
      }
    },

    *getUser(_, { put }) {
      try {
        const user = yield getUserService()
        yield put({ type: 'save', payload: { user } })
      } catch (error) {
        //
      }
      yield put({ type: 'save', payload: { requested: true } })
    },

    *signOut(_, { put }) {
      yield put({
        type: 'save',
        payload: {},
      })

      localStorage.removeItem(ACCESS_TOKEN_NAME)
    },

    *updateUser({ payload }, { put }) {
      try {
        const { nickname, location, avatar, bio } = payload
        const result = yield updateUserService(nickname, location, avatar, bio)

        if (result && result.code === 0) {
          yield put({
            type: 'saveUser',
            payload: { ...payload },
          })
          yield put({
            type: 'save',
            payload: {
              success: true,
              message: 'account.success',
            },
          })
        }
      } catch (error: any) {
        yield put({
          type: 'save',
          payload: {
            error: true,
            message: sagaErrorStatusHandler(error),
          },
        })
      }
    },

    *updatePassword({ payload }, { put }) {
      try {
        const { oldPassword, newPassword } = payload
        const result = yield updatePasswordService(oldPassword, newPassword)

        if (result && result.code === 0) {
          yield put({
            type: 'save',
            payload: {
              success: true,
              message: 'account.password.success',
            },
          })
        }

        if (result && result.code) {
          yield put({
            type: 'save',
            payload: {
              success: false,
              error: true,
              message: sagaErrorCodeHandler(result.code),
            },
          })
        }
      } catch (error: any) {
        yield put({
          type: 'save',
          payload: {
            error: true,
            message: sagaErrorStatusHandler(error),
          },
        })
      }
    },
  },

  reducers: {
    save: (state, action) => {
      return { ...state, ...action.payload }
    },
    saveUser: (state, action) => {
      return { ...state, user: { ...state?.user, ...action.payload } }
    },
    clearNotification: (state) => {
      if (state) {
        return {
          ...state,
          error: false,
          success: false,
          message: undefined,
        }
      }

      return {
        ...initialState,
      }
    },
  },
}

export default AuthModel
