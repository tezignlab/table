import request from 'umi-request'
import { IDefaultReturnType } from '@/services/index'
import { Project, ProjectDetail } from '@/models/project'
import { Collection } from '@/models/collection'
import { ProjectCollection } from '@/models/projectCollection'

export const getProjects = async (
  skip: number,
  limit: number,
): Promise<IDefaultReturnType<Project[]>> => {
  const result = await request(`/api/v1/projects?skip=${skip}&limit=${limit}`, {
    method: 'get',
    skipErrorHandler: true,
  })

  return result
}

export const getProjectDetail = async (
  id: string,
): Promise<IDefaultReturnType<ProjectDetail>> => {
  const result = await request(`/api/v1/projects/${id}`, {
    method: 'get',
    skipErrorHandler: true,
  })

  return result
}

export const likeProject = async (id: string): Promise<IDefaultReturnType> => {
  const result = await request(`/api/v1/project/like/${id}`, {
    method: 'put',
    skipErrorHandler: true,
  })

  return result
}

export const unlikeProject = async (id: string): Promise<IDefaultReturnType> => {
  const result = await request(`/api/v1/project/like/${id}`, {
    method: 'delete',
    skipErrorHandler: true,
  })

  return result
}

export const getLikedProjects = async (
  userId: string,
  skip: number,
  limit: number,
): Promise<IDefaultReturnType<Project[]>> => {
  const result = await request(
    `/api/v1/project/likes/${userId}?skip=${skip}&limit=${limit}`,
    {
      method: 'get',
      skipErrorHandler: true,
    },
  )

  return result
}

export const collectProject = async (
  projectId: string,
  collectionId: string,
  method: 'post' | 'delete',
): Promise<IDefaultReturnType> => {
  const result = await request(
    `/api/v1/project/${projectId}/collect/${collectionId}`,
    {
      method: method,
      skipErrorHandler: true,
    },
  )

  return result
}

export const getCollectionsList = async (
  userId: string,
): Promise<IDefaultReturnType<Collection[]>> => {
  const result = await request(`/api/v1/project/collections/${userId}`, {
    method: 'get',
    skipErrorHandler: true,
  })

  return result
}

export const getCollectionDetail = async (
  id: string,
): Promise<IDefaultReturnType<Collection>> => {
  const result = await request(`/api/v1/project/collection/${id}`, {
    method: 'get',
    skipErrorHandler: true,
  })

  return result
}

export const getCollectionDetailList = async (
  id: string,
  skip: number,
  limit: number,
): Promise<IDefaultReturnType<Project[]>> => {
  const result = await request(
    `/api/v1/project/collect/${id}?skip=${skip}&limit=${limit}`,
    {
      method: 'get',
      skipErrorHandler: true,
    },
  )

  return result
}

export const getProjectCollection = async (
  id: string,
): Promise<IDefaultReturnType<ProjectCollection[]>> => {
  const result = await request(`/api/v1/project/${id}/collections`, {
    method: 'get',
    skipErrorHandler: true,
  })

  return result
}

export const viewProject = async (id: string): Promise<IDefaultReturnType> => {
  const result = await request(`/api/v1/project/view/${id}`, {
    method: 'post',
    skipErrorHandler: true,
  })

  return result
}

export const getViewedProjectsList = async (
  skip: number,
  limit: number,
): Promise<IDefaultReturnType<Project[]>> => {
  const result = await request(
    `/api/v1/project/views?skip=${skip}&limit=${limit}`,
    {
      method: 'get',
      skipErrorHandler: true,
    },
  )

  return result
}

export const createCollection = async (
  name: string,
  desc: string,
): Promise<IDefaultReturnType<Collection>> => {
  const result = await request('/api/v1/project/collection', {
    method: 'post',
    data: {
      name,
      desc,
    },
    skipErrorHandler: true,
  })

  return result
}

export const deleteCollection = async (
  id: string,
): Promise<IDefaultReturnType> => {
  const result = await request(`/api/v1/project/collection/${id}`, {
    method: 'delete',
    skipErrorHandler: true,
  })

  return result
}

export const updateCollection = async (
  id: string,
  data: { name: string; desc: string },
): Promise<IDefaultReturnType> => {
  const result = await request(`/api/v1/project/collection/${id}`, {
    method: 'put',
    data: data,
    skipErrorHandler: true,
  })

  return result
}

export const getSearchProjects = async (
  query: string,
  skip: number,
  limit: number,
): Promise<IDefaultReturnType<Project[]>> => {
  const result = await request(
    `/api/v1/project/search?keyword=${query}&skip=${skip}&limit=${limit}`,
    {
      method: 'get',
      skipErrorHandler: true,
    },
  )

  return result
}

export const getRecommendProjects = async (
  skip: number,
  limit: number,
): Promise<IDefaultReturnType<Project[]>> => {
  const result = await request(
    `/api/v1/project/recommend?skip=${skip}&limit=${limit}`,
    {
      method: 'get',
      skipErrorHandler: true,
    },
  )

  return result
}
