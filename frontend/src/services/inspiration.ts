import { Inspiration } from '@/types/inspiration'
import axios from 'axios'
import { IDefaultPageDataReturnType } from '../services/index'

export const getInspiration = async (skip: number, limit: number): Promise<IDefaultPageDataReturnType<Inspiration>> =>
  (await axios.get(`/api/v1/inspirations?skip=${skip}&limit=${limit}`)).data
