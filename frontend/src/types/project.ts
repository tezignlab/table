import { Collection } from './collection'

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
  collections: Collection[]
}

export interface ProjectDetail extends Project {
  content: string
  tags: string[]
}
