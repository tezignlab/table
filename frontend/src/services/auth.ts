import axios from 'axios'
import { User } from '../models/auth'
import { IDefaultReturnType } from './index'

export const signIn = async (
  username: string,
  password: string,
): Promise<IDefaultReturnType<{ token_type: string; access_token: string }>> =>
  (
    await axios.post('/api/v1/login', {
      requestType: 'form',
      data: { username, password },
    })
  ).data

export const signUp = async (
  username: string,
  password: string,
  email: string,
): Promise<IDefaultReturnType> =>
  (
    await axios.post('/api/v1/register', {
      requestType: 'json',
      data: { username, password, email },
    })
  ).data

export const getVerificationCode = async (
  phone: string,
): Promise<IDefaultReturnType> =>
  (
    await axios.post('/api/v1/login/sms/code', {
      requestType: 'json',
      data: { phone },
    })
  ).data

export const signInWithCode = async (
  phone: string,
  code: string,
): Promise<IDefaultReturnType> =>
  (
    await axios.post('/api/v1/login/sms', {
      requestType: 'json',
      data: { phone, code },
    })
  ).data

export const activateUser = async (
  code: string,
): Promise<IDefaultReturnType<{ token_type: string; access_token: string }>> =>
  (
    await axios.post('/api/v1/activate', {
      requestType: 'json',
      data: { code },
    })
  ).data

export const getUser = async (): Promise<User> =>
  (await axios.get('/api/v1/user')).data

export const getCurrentUser = async (
  username: string,
): Promise<IDefaultReturnType<User>> =>
  (await axios.get(`/api/v1/user/${username}`)).data

export const updateUser = async (
  nickname: string,
  avatar: string,
  location: string,
  bio: string,
): Promise<IDefaultReturnType> =>
  (
    await axios.patch('/api/v1/user', {
      data: { nickname, avatar, location, bio },
    })
  ).data

export const updatePassword = async (
  password: string,
  newPassword: string,
): Promise<IDefaultReturnType> =>
  (
    await axios.patch('/api/v1/user/password', {
      data: { new_password: newPassword, old_password: password },
    })
  ).data
