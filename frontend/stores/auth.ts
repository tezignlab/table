import { atom, selector } from 'recoil'

export interface User {
  id: string
  username: string
  nickname: string
  email?: string
  avatar: string
  location?: string
  bio?: string
}

export interface AuthState {
  user?: User
  verificationCodeRequesting?: boolean
  error?: boolean
  message?: string
  success?: boolean
  requested?: boolean
}

export const authStatusState = atom<AuthState>({
  key: 'authStatus',
  default: {
    user: undefined,
    verificationCodeRequesting: false,
    error: false,
    message: undefined,
    success: false,
    requested: false,
  },
})

export interface CurrentUserStatus {
  user?: User
  loading?: boolean
  error?: boolean
}

export const currentUserStatusState = atom<CurrentUserStatus>({
  key: 'currentUserStatus',
  default: {
    user: undefined,
    loading: false,
    error: false,
  },
})