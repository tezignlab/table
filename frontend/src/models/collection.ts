import { Effect, Reducer } from 'umi'
import {
  getCollectionsList as getCollectionsService,
  getCollectionDetail as getCollectionDetailService,
  deleteCollection as deleteCollectionService,
  updateCollection as updateCollectionService,
} from '@/services/project'
import { User } from '@/models/auth'

export interface Collection {
  id: string
  name: string
  desc?: string
  covers?: string[]
  createTime: number
}

export interface CollectionDetail extends Collection {
  user: User
}

export interface CollectionModelState {
  collections?: Collection[]
  current?: Collection
  loading?: boolean
}

export interface CollectionModelType {
  namespace: 'collection'

  state: CollectionModelState

  effects: {
    getCollections: Effect
    getCollectionDetail: Effect
    deleteCollection: Effect
    updateCollection: Effect
  }

  reducers: {
    save: Reducer<CollectionModelState>
  }
}

const initialState: CollectionModelState = {
  collections: [],
  loading: false,
}

const CollectionModel: CollectionModelType = {
  namespace: 'collection',

  state: initialState,

  effects: {
    *getCollections({ payload }, { put }) {
      yield put({ type: 'save', payload: { loading: true } })

      try {
        const { userId } = payload
        const result = yield getCollectionsService(userId)

        if (result && result.code === 0) {
          yield put({
            type: 'save',
            payload: { collections: result.data },
          })
        }
      } catch (error) {
        //
      }

      yield put({ type: 'save', payload: { loading: false } })
    },
    *getCollectionDetail({ payload }, { put }) {
      const { id } = payload
      yield put({ type: 'save', payload: { loading: true } })

      try {
        const result = yield getCollectionDetailService(id)

        if (result && result.code === 0) {
          yield put({
            type: 'save',
            payload: { current: result.data },
          })
        }
      } catch (error) {
        //
      }
      yield put({ type: 'save', payload: { loading: false } })
    },
    *deleteCollection({ payload }, { put, select }) {
      const { id, index } = payload
      yield put({ type: 'save', payload: { loading: true } })

      try {
        const result = yield deleteCollectionService(id)

        if (result && result.code === 0) {
          const state = yield select()

          yield put({
            type: 'save',
            payload: {
              collections: [
                ...state.collection.collections.slice(0, index),
                ...state.collection.collections.slice(index + 1),
              ],
            },
          })
        }
      } catch (error) {
        //
      }

      yield put({ type: 'save', payload: { loading: false } })
    },
    *updateCollection({ payload }, { put }) {
      const { id, data } = payload
      yield put({ type: 'save', payload: { loading: true } })

      try {
        const result = yield updateCollectionService(id, data)

        if (result && result.code === 0) {
          yield put({
            type: 'getCollectionDetail',
            payload: { id },
          })
        }
      } catch (error) {
        //
      }

      yield put({ type: 'save', payload: { loading: false } })
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

export default CollectionModel
