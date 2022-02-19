import { Effect, Reducer } from 'umi'
import { getInspiration as getInspirationService } from '@/services/inspiration'

export interface Inspiration {
  id: string
  content: string
  files: File[]
  tag: []
  create_time: number
  update_time: number
}

export interface File {
  id: string
  content_type: string
  url: string
  thumbnail: string
}

export interface InspirationModelState {
  inspiration?: Inspiration[]
  count: number
  hasMoreInspiration: boolean
}

export interface InspirationModelType {
  namespace: 'inspiration'
  state: InspirationModelState
  effects: {
    getInspiration: Effect
  }
  reducers: {
    saveList: Reducer<InspirationModelState>
    clear: Reducer<InspirationModelState>
  }
}

const initialState: InspirationModelState = {
  inspiration: [],
  count: 0,
  hasMoreInspiration: true,
}

const InspirationModel: InspirationModelType = {
  namespace: 'inspiration',
  state: initialState,
  effects: {
    *getInspiration({ payload }, { put }) {
      const { skip, limit } = payload
      try {
        const result = yield getInspirationService(skip, limit)

        if (result && result.code === 0) {
          yield put({ type: 'saveList', payload: result.data })
        }
      } catch (error) {
        // yield put({})
      }
    },
  },
  reducers: {
    saveList(state, { payload }) {
      if (!!state && !!state.inspiration) {
        return {
          ...state,
          inspiration: [...state.inspiration, ...payload.data],
          count: state.count + payload.data.length,
          hasMoreInspiration: payload.has_more,
        }
      }
      return {
        ...state,
        inspiration: payload.data,
        count: payload.data.length,
        hasMoreInspiration: payload.has_more,
      }
    },
    clear() {
      return { ...initialState }
    },
  },
}
export default InspirationModel
