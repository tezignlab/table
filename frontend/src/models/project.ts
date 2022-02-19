import { Effect, Reducer } from 'umi'
import {
  getProjects as getProjectsService,
  getProjectDetail as getProjectDetailService,
  likeProject as likeProjectService,
  unlikeProject as unlikeProjectService,
  getLikedProjects as getLikedProjectsService,
  getCollectionDetailList as getCollectionDetailListService,
  getSearchProjects as getSearchProjectsService,
  viewProject as viewProjectService,
  getViewedProjectsList as getViewedProjectsListService,
  getRecommendProjects as getRecommendProjectsService,
} from '@/services/project'

export interface Author {
  home: string
  name: string
  avatar: string
}

export interface Project {
  id: string
  user_id: string
  author: Author
  origin: string
  origin_url: string
  title: string
  cover: string
  publish_time: number
  count_read: number
  count_like: number
  is_like: boolean
  is_collect: boolean
  like_loading: boolean
  collect_loading: boolean
}

export interface ProjectDetail extends Project {
  content: string
  // tags: string[]
  // baidu_tags: string[]
  tags: { type: ''; data: string[] }[]
}

export interface ProjectModelState {
  projects?: Project[]
  hasMoreProjects?: boolean
  count?: number
  currentId?: string
  currentIndex?: number
  current?: ProjectDetail
}

export interface ProjectModelType {
  namespace: 'project'
  state: ProjectModelState
  effects: {
    getProjects: Effect
    getProjectDetail: Effect
    likeProject: Effect
    unlikeProject: Effect
    viewProject: Effect
  }
  reducers: {
    saveList: Reducer<ProjectModelState>
    saveDetail: Reducer<ProjectModelState>
    clearDetail: Reducer<ProjectModelState>
    getProjectDetail: Reducer<ProjectModelState>
    save: Reducer<ProjectModelState>
    updateProject: Reducer<ProjectModelState>
    clear: Reducer<ProjectModelState>
  }
}

const initialState: ProjectModelState = {
  projects: [],
  count: 0,
  hasMoreProjects: true,
  currentId: undefined,
  currentIndex: undefined,
  current: undefined,
}

const ProjectModel: ProjectModelType = {
  namespace: 'project',

  state: initialState,

  effects: {
    *getProjects({ payload }, { put }) {
      const { skip, limit, type } = payload
      try {
        let result = undefined
        if (type === 'all') {
          result = yield getProjectsService(skip, limit)
        } else if (type === 'likes') {
          result = yield getLikedProjectsService(payload.userId, skip, limit)
        } else if (type === 'collections') {
          result = yield getCollectionDetailListService(
            payload.collectionId,
            skip,
            limit,
          )
        } else if (type === 'search') {
          result = yield getSearchProjectsService(payload.query, skip, limit)
        } else if (type === 'history') {
          result = yield getViewedProjectsListService(skip, limit)
        } else if (type === 'recommend') {
          result = yield getRecommendProjectsService(skip, limit)
        }

        if (result && result.code === 0) {
          yield put({ type: 'saveList', payload: result.data })
        }
      } catch (error) {
        // yield put({})
      }
    },

    *getProjectDetail({ payload }, { put }) {
      const { id } = payload

      yield put({ type: 'viewProject', payload: { id } })

      try {
        const result = yield getProjectDetailService(id)

        const { tags, baidu_tags } = result.data

        yield put({
          type: 'saveDetail',
          payload: {
            ...result.data,
            tags: [
              {
                type: 'project',
                data: tags,
              }
            ],
            like_loading: false,
            collect_loading: false,
          },
        })
      } catch (error) {
        // yield put({})
      }
    },

    *likeProject({ payload }, { put, select }) {
      // `index` is to modify the value in projectList

      // e.g., you like a project, so the corresponding project in list should be modified
      // and index is to locate where the project is
      const { id, index } = payload

      yield put({
        type: 'updateProject',
        payload: { index: index, data: { like_loading: true } },
      })

      try {
        const result = yield likeProjectService(id)
        const state = yield select()

        if (result && result.code === 0) {
          yield put({
            type: 'updateProject',
            payload: {
              index: index,
              data: {
                is_like: true,
                count_like: state?.project?.current?.count_like + 1,
              },
            },
          })
        }
      } catch (error) {
        // yield put({})
      }

      yield put({
        type: 'updateProject',
        payload: { index: index, data: { like_loading: false } },
      })
    },

    *unlikeProject({ payload }, { put, select }) {
      const { id, index } = payload

      yield put({
        type: 'updateProject',
        payload: { index: index, data: { like_loading: true } },
      })

      try {
        const result = yield unlikeProjectService(id)
        const state = yield select()

        // the same process as the likeProject
        if (result && result.code === 0) {
          yield put({
            type: 'updateProject',
            payload: {
              index: index,
              data: {
                is_like: false,
                count_like: state?.project?.current?.count_like - 1,
              },
            },
          })
        }
      } catch (error) {
        // yield put({})
      }

      yield put({
        type: 'updateProject',
        payload: { index: index, data: { like_loading: false } },
      })
    },

    *viewProject({ payload }) {
      const { id } = payload
      try {
        yield viewProjectService(id)
      } catch (error) {
        //
      }
    },
  },

  reducers: {
    saveList(state, { payload }) {
      if (!!state && !!state.projects) {
        return {
          ...state,
          projects: [...state.projects, ...payload.data],
          count: state.count + payload.data.length,
          hasMoreProjects: payload.has_more,
        }
      }
      return {
        ...state,
        projects: payload.data,
        count: payload.data.length,
        hasMoreProjects: payload.has_more,
      }
    },

    saveDetail(state, { payload }) {
      return { ...state, current: payload }
    },

    getProjectDetail(state, { payload }) {
      return { ...state, currentId: payload.id, currentIndex: payload.index }
    },

    clearDetail(state) {
      return {
        ...state,
        current: undefined,
        currentId: undefined,
        hasMoreProjects: true,
      }
    },

    save(state, action) {
      return { ...state, ...action.payload }
    },

    updateProject(state, { payload }) {
      const { data, index } = payload

      // update project in list if index exists
      const updateIndex = index ?? state?.currentIndex

      if (!!state && !!state.projects && updateIndex !== undefined) {
        state = {
          ...state,
          projects: [
            ...state.projects.slice(0, updateIndex),
            {
              ...state.projects[updateIndex],
              ...data,
            },
            ...state.projects.slice(updateIndex + 1),
          ],
        }
      }

      // also update current project if exists
      if (!!state && !!state.current) {
        state = {
          ...state,
          current: {
            ...state.current,
            ...data,
          },
        }
      }

      return { ...state }
    },
    clear() {
      return { ...initialState }
    },
  },
}

export default ProjectModel
