import { atom } from 'recoil'

export interface Collection {
  id: string
  name: string
  desc?: string
  covers?: string[]
  createTime: number
}

export interface CollectionModelState {
  collections?: Collection[]
  current?: Collection
  loading?: boolean
}

export const allCollectionsStatusState = atom<CollectionModelState>({
  key: 'allCollections',
  default: {
    collections: [],
    loading: false,
  },
})
