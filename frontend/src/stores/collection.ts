import { Collection } from '@/types/collection'
import { atom } from 'recoil'

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
