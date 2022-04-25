import { atom } from 'recoil'

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

export interface ProjectState {
  projects?: Project[]
  hasMoreProjects?: boolean
  count: number
  currentId?: string
  currentIndex?: number
  current?: ProjectDetail
}

export const projectStateState = atom<ProjectState>({
  key: 'project',
  default: {
    count: 0,
    hasMoreProjects: true,
    currentId: undefined,
    currentIndex: undefined,
    current: undefined,
  },
})
