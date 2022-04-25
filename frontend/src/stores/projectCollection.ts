import { atom } from 'recoil'
import { Collection } from './collection'

export interface ProjectCollection extends Collection {
  is_collect: boolean
  loading: boolean
}

export interface ProjectCollectionState {
  loading?: boolean
  projectId?: string
  projectIndex?: number
  collections?: ProjectCollection[]
}

export const projectCollectionStateState = atom<ProjectCollectionState>({
  key: 'projectCollection',
  default: {
    loading: false,
    projectId: undefined,
    projectIndex: undefined,
    collections: undefined,
  },
})
