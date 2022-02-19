import request from 'umi-request'
import { IDefaultReturnType } from '@/services/index'
import { Inspiration } from '@/models/inspiration'

export const getInspiration = async (
  skip: number,
  limit: number,
): Promise<IDefaultReturnType<Inspiration>> => {
  const result = await request(
    `/api/v1/inspirations?skip=${skip}&limit=${limit}`,
    {
      method: 'get',
      skipErrorHandler: true,
    },
  )
  return result
}
