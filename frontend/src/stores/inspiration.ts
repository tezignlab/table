import { Inspiration } from '@/types/inspiration'
import { atom } from 'recoil'


export interface InspirationState {
  inspiration?: Inspiration[]
  count: number
  hasMoreInspiration: boolean
}

export const inspirationStateState = atom<InspirationState>({
  key: 'inspiration',
  default: {
    inspiration: [],
    count: 0,
    hasMoreInspiration: true,
  },
})
