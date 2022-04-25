import axios from 'axios'
import { Inspiration } from '../models/inspiration'
import { IDefaultReturnType } from '../services/index'

export const getInspiration = async (skip: number, limit: number): Promise<IDefaultReturnType<Inspiration>> =>
  (await axios.get(`/api/v1/inspirations?skip=${skip}&limit=${limit}`)).data
