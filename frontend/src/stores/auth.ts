import { atom, selector } from 'recoil'

interface Status {
  verificationCodeRequesting?: boolean
  error?: boolean
  message?: string
  success?: boolean
  requested?: boolean
}

export interface User {
  id: string
  username: string
  nickname: string
  email?: string
  avatar: string
  location?: string
  bio?: string
}

export const authStatusState = atom<Status>({
  key: 'authStatus',
  default: {
    verificationCodeRequesting: false,
    error: false,
    message: undefined,
    success: false,
    requested: false,
  },
})

export const authUserState = atom<User | undefined>({
  key: 'authUser',
  default: undefined,
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

export const isAuthState = selector({
  key: 'isAuthState',
  get: ({ get }) => {
    const requested = get(authStatusState).requested
    const user = get(authUserState)

    return requested && user
  },
})
