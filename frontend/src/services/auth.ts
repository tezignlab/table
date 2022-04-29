import { ACCESS_TOKEN_NAME } from '@/constants/index'
import { User } from '@/types/user';
import axios from 'axios'
import { AuthToken, IDefaultReturnType } from './index'

export const signIn = async ({ username, password }: { username: string; password: string }) => {
  const bodyFormData = new FormData()
  bodyFormData.append('username', username)
  bodyFormData.append('password', password)
  return (
    await axios.request<AuthToken>({
      url: '/api/v1/login',
      method: 'post',
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  ).data
}

export const signUp = async ({ username, password, email }: { username: string; password: string; email: string }) =>
  (
    await axios.request<IDefaultReturnType<AuthToken>>({
      url: '/api/v1/register',
      method: 'post',
      data: {
        username,
        password,
        email,
      },
    })
  ).data

export const getUser = async () => (await axios.request<IDefaultReturnType<User>>({ url: '/api/v1/user' })).data

export const getCurrentUser = async (username: string): Promise<IDefaultReturnType<User>> =>
  (await axios.get(`/api/v1/user/${username}`)).data

interface IUpdateUser {
  nickname?: string
  avatar?: string
  location?: string
  bio?: string
}

export const updateUser = async (data: IUpdateUser) =>
  (await axios.request<IDefaultReturnType>({ url: '/api/v1/user', method: 'patch', data: data })).data

export const updatePassword = async ({ password, newPassword }: { password: string; newPassword: string }) =>
  (
    await axios.request<IDefaultReturnType>({
      url: '/api/v1/user/password',
      method: 'patch',
      data: { new_password: newPassword, old_password: password },
    })
  ).data

export const signOut = () => {
  localStorage.removeItem(ACCESS_TOKEN_NAME)
}
