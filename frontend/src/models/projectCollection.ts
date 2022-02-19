import { Effect, Reducer } from 'umi'
import {
  getProjectCollection,
  collectProject as collectProjectService,
  createCollection as createCollectionService,
} from '@/services/project'
import { Collection } from '@/models/collection'

export interface ProjectCollection extends Collection {
  is_collect: boolean
  loading: boolean
}

export interface ProjectCollectionModelState {
  loading?: boolean
  projectId?: string
  projectIndex?: number
  collections?: ProjectCollection[]
}

export interface ProjectCollectionModelType {
  namespace: 'projectCollection'
  state: ProjectCollectionModelState
  effects: {
    getCollections: Effect
    createCollection: Effect
    collectProject: Effect
    updateProjects: Effect
  }
  reducers: {
    clear: Reducer<ProjectCollectionModelState>
    save: Reducer<ProjectCollectionModelState>
    updateCollections: Reducer<ProjectCollectionModelState>
    getCollections: Reducer<ProjectCollectionModelState>
  }
}

const initialState: ProjectCollectionModelState = {
  loading: false,
  projectId: undefined,
  projectIndex: undefined,
  collections: undefined,
}

const CollectionModel: ProjectCollectionModelType = {
  namespace: 'projectCollection',

  state: initialState,

  effects: {
    *getCollections({ payload }, { put }) {
      yield put({ type: 'save', payload: { loading: true } })
      try {
        const { id: projectId, requireUpdate } = payload
        const result = yield getProjectCollection(projectId)

        yield put({
          type: 'save',
          payload: { collections: result.data },
        })

        if (requireUpdate) {
          yield put({
            type: 'updateProjects',
          })
        }
      } catch (error) {
        //
      }
      yield put({ type: 'save', payload: { loading: false } })
    },
    *createCollection({ payload }, { put, select }) {
      yield put({ type: 'save', payload: { loading: true } })
      try {
        const { name, desc } = payload
        const result = yield createCollectionService(name, desc)

        if (result && result.code === 0) {
          const state = yield select()

          yield put({
            type: 'collectProject',
            payload: {
              projectId: state.projectCollection.projectId,
              collectionId: result.data.id,
              method: 'post',
              index: state.projectCollection.projectIndex,
              requireReload: true,
            },
          })
        }
      } catch (error) {
        //
      }
    },
    *collectProject({ payload }, { put, select }) {
      const { collectionId, collectionIndex, method, requireReload } = payload

      const state = yield select()
      const { projectId, projectIndex } = state.projectCollection

      try {
        yield put({
          type: 'updateCollections',
          payload: {
            collectionIndex: collectionIndex,
            data: { loading: true },
          },
        })

        const result = yield collectProjectService(projectId, collectionId, method)

        if (result && result.code === 0) {
          if (requireReload) {
            yield put({
              type: 'getCollections',
              payload: {
                id: projectId,
                projectIndex: projectIndex,
                requireUpdate: true,
              },
            })
          } else {
            yield put({
              type: 'updateCollections',
              payload: {
                collectionIndex: collectionIndex,
                data: { is_collect: method === 'post', loading: false },
              },
            })
            yield put({
              type: 'updateProjects',
            })
          }
        }
      } catch (error) {
        //

        yield put({
          type: 'updateCollections',
          payload: {
            collectionIndex: collectionIndex,
            data: { loading: false },
          },
        })
      }
    },

    *updateProjects(_, { put, select }) {
      const state = yield select()

      let isCollect = false
      state?.projectCollection?.collections?.forEach((item: ProjectCollection) => {
        isCollect = isCollect || item.is_collect
      })

      yield put({
        type: 'project/updateProject',
        payload: {
          index: state.projectCollection.projectIndex,
          data: { is_collect: isCollect },
        },
      })
    },
  },

  reducers: {
    clear() {
      return { ...initialState }
    },
    save(state, { payload }) {
      return { ...state, ...payload }
    },
    updateCollections(state, { payload }) {
      const { collectionIndex, data } = payload

      if (state && state.collections) {
        return {
          ...state,
          collections: [
            ...state.collections.slice(0, collectionIndex),
            {
              ...state.collections[collectionIndex],
              ...data,
            },
            ...state.collections.slice(collectionIndex + 1),
          ],
        }
      }

      return { ...initialState }
    },
    getCollections(state, { payload }) {
      const { id, projectIndex } = payload
      return { ...state, projectId: id, projectIndex: projectIndex }
    },
  },
}

export default CollectionModel
