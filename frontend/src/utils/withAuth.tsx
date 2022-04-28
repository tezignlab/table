import { authUserState } from '@/stores/auth'
import { useRouter } from 'next/router'
import type { FC, MouseEventHandler } from 'react'
import { useRecoilValue } from 'recoil'

export const withAuth: <T extends { onClick?: MouseEventHandler }>(Component: FC<T>) => FC<T> = (Component) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    const authUser = useRecoilValue(authUserState)
    const router = useRouter()

    return (
      <Component
        {...props}
        onClick={(e) => {
          if (!authUser) router.push('/auth/sign-in')
          else props.onClick?.(e)
        }}
      />
    )
  }
}
