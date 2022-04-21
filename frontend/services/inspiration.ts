import { IDefaultReturnType } from '../services/index'
import { Inspiration } from '../models/inspiration'
import axios from 'axios'

export const getInspiration = async (
  skip: number,
  limit: number,
): Promise<IDefaultReturnType<Inspiration>> =>
  (await axios.get(`/api/v1/inspirations?skip=${skip}&limit=${limit}`)).data
