import { Collection } from '@/types/collection'
import { Project, ProjectDetail } from '@/types/project'
import axios from 'axios'
import { IDefaultPageDataReturnType, IDefaultReturnType } from '.'

export const getProjects = async ({ skip, limit }: { skip: number; limit: number }) => {
  const urlParams = new URLSearchParams()
  urlParams.set('skip', skip.toString())
  urlParams.set('limit', limit.toString())
  const result = await axios.get<IDefaultPageDataReturnType<Project>>(`/api/v1/projects?${urlParams.toString()}`)
  return result.data
}

export const getProjectDetail = async (id: string): Promise<IDefaultReturnType<ProjectDetail>> =>
  (await axios.get(`/api/v1/projects/${id}`)).data

export const likeProject = async (id: string): Promise<IDefaultReturnType> =>
  (await axios.put(`/api/v1/project/like/${id}`)).data

export const unlikeProject = async (id: string): Promise<IDefaultReturnType> =>
  (await axios.delete(`/api/v1/project/like/${id}`)).data

export const getLikedProjects = async (
  userId: string,
  skip: number,
  limit: number,
): Promise<IDefaultPageDataReturnType<Project>> =>
  (await axios.get(`/api/v1/project/likes/${userId}?skip=${skip}&limit=${limit}`)).data

export const collectProject = async (
  projectId: string,
  collectionId: string,
  method: 'post' | 'delete',
): Promise<IDefaultReturnType> => (await axios[method](`/api/v1/project/${projectId}/collect/${collectionId}`)).data

export const getCollectionsList = async (userId: string): Promise<IDefaultReturnType<Collection[]>> =>
  (await axios.get(`/api/v1/project/collections/${userId}`)).data

export const getCollectionDetail = async (id: string): Promise<IDefaultReturnType<Collection>> =>
  (await axios.get(`/api/v1/project/collection/${id}`)).data

export const getCollectionDetailList = async (
  id: string,
  skip: number,
  limit: number,
): Promise<IDefaultPageDataReturnType<Project>> =>
  (await axios.get(`/api/v1/project/collect/${id}?skip=${skip}&limit=${limit}`)).data

// export const getProjectCollection = async (id: string): Promise<IDefaultPageDataReturnType<Collection>> =>
//   (await axios.get(`/api/v1/project/${id}/collections`)).data

export const viewProject = async (id: string): Promise<IDefaultReturnType> =>
  (await axios.post(`/api/v1/project/view/${id}`)).data

export const getViewedProjectsList = async (
  skip: number,
  limit: number,
): Promise<IDefaultPageDataReturnType<Project>> =>
  (await axios.get(`/api/v1/project/views?skip=${skip}&limit=${limit}`)).data

export const createCollection = async (name: string, desc: string): Promise<IDefaultReturnType<Collection>> =>
  (
    await axios.post('/api/v1/project/collection', {
      name,
      desc,
    })
  ).data

export const deleteCollection = async (id: string): Promise<IDefaultReturnType> =>
  (await axios.delete(`/api/v1/project/collection/${id}`)).data

export const updateCollection = async (id: string, data: { name: string; desc: string }): Promise<IDefaultReturnType> =>
  (await axios.put(`/api/v1/project/collection/${id}`, data)).data

export const getSearchProjects = async (
  query: string,
  skip: number,
  limit: number,
): Promise<IDefaultPageDataReturnType<Project>> =>
  (await axios.get(`/api/v1/project/search?keyword=${query}&skip=${skip}&limit=${limit}`)).data

export const getRecommendProjects = async ({
  skip,
  limit,
}: {
  skip: number
  limit: number
}): Promise<IDefaultPageDataReturnType<Project>> =>
  (await axios.get(`/api/v1/project/recommend?skip=${skip}&limit=${limit}`)).data
