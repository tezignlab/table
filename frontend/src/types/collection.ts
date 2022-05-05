import { User } from "./user"

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