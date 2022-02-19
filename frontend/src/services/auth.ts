import request from 'umi-request'
import { User } from '@/models/auth'
import { IDefaultReturnType } from './index'

export const signIn = async (
  username: string,
  password: string,
): Promise<
  IDefaultReturnType<{ token_type: string; access_token: string }>
> => {
  const result = await request('/api/v1/login', {
    method: 'post',
    requestType: 'form',
    data: { username, password },
    skipErrorHandler: true,
  })
  return result
}

export const signUp = async (
  username: string,
  password: string,
  email: string,
): Promise<IDefaultReturnType> => {
  const result = await request('/api/v1/register', {
    method: 'post',
    requestType: 'json',
    data: { username, password, email },
    skipErrorHandler: true,
  })
  return result
}

export const getVerificationCode = async (
  phone: string,
): Promise<IDefaultReturnType> => {
  const result = await request('/api/v1/login/sms/code', {
    method: 'post',
    requestType: 'json',
    data: { phone },
    skipErrorHandler: true,
  })

  return result
}

export const signInWithCode = async (
  phone: string,
  code: string,
): Promise<IDefaultReturnType> => {
  const result = await request('/api/v1/login/sms', {
    method: 'post',
    requestType: 'json',
    data: { phone, code },
    skipErrorHandler: true,
  })

  return result
}

export const activateUser = async (
  code: string,
): Promise<
  IDefaultReturnType<{ token_type: string; access_token: string }>
> => {
  const result = await request('/api/v1/activate', {
    method: 'post',
    requestType: 'json',
    data: { code },
    skipErrorHandler: true,
  })
  return result
}

export const getUser = async (): Promise<User> => {
  const result = await request('/api/v1/user', {
    method: 'get',
  })
  return result.data
}

export const getCurrentUser = async (
  username: string,
): Promise<IDefaultReturnType<User>> => {
  const result = await request(`/api/v1/user/${username}`, {
    method: 'get',
    skipErrorHandler: true,
  })

  return result
}

export const updateUser = async (
  nickname: string,
  avatar: string,
  location: string,
  bio: string,
): Promise<IDefaultReturnType> => {
  const result = await request('/api/v1/user', {
    method: 'patch',
    data: { nickname, avatar, location, bio },
    skipErrorHandler: true,
  })

  return result
}

export const updatePassword = async (
  password: string,
  newPassword: string,
): Promise<IDefaultReturnType> => {
  const result = await request('/api/v1/user/password', {
    method: 'patch',
    data: { new_password: newPassword, old_password: password },
    skipErrorHandler: true,
  })

  return result
}
