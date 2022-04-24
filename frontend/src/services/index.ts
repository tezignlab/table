export interface IDefaultReturnType<T = void> {
  code: number
  message: string
  data: T
}

export interface IDefaultPageDataReturnType<T = void> {
  code: number
  message: string
  skip: number
  limit: number
  total: number
  has_more: boolean
  data: T
}
export interface AuthToken {
  token_type: string
  access_token: string
  expire:number
}
