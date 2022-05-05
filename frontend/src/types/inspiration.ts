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