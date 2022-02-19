import { Effect, Reducer } from 'umi'
import { User } from '@/models/auth'
import { getCurrentUser as getCurrentUserService } from '@/services/auth'

export interface CurrentUserModelState {
  user?: User
  loading?: boolean
  error?: boolean
}

export interface CurrentUserModelType {
  namespace: 'currentUser'
  state: CurrentUserModelState
  effects: {
    getCurrentUser: Effect
  }
  reducers: {
    save: Reducer<CurrentUserModelState>
    clear: Reducer<CurrentUserModelState>
  }
}

const initialState: CurrentUserModelState = {
  user: undefined,
  loading: false,
  error: false,
}

const CurrentUserModel: CurrentUserModelType = {
  namespace: 'currentUser',

  state: initialState,

  effects: {
    *getCurrentUser({ payload }, { put }) {
      yield put({ type: 'save', payload: { loading: true } })

      const { username } = payload

      try {
        const result = yield getCurrentUserService(username)
        if (result && result.code === 0) {
          yield put({
            type: 'save',
            payload: {
              user: result.data,
            },
          })
        }
      } catch (error) {
        yield put({
          type: 'save',
          payload: { error: true },
        })
      }

      yield put({ type: 'save', payload: { loading: false } })
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },
    clear() {
      return { ...initialState }
    },
  },
}

export default CurrentUserModel
