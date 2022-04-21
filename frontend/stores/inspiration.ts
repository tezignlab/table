import { atom } from 'recoil'

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
