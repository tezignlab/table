import { authUserState } from '@/stores/auth'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { useRecoilValue } from 'recoil'
import HorizontalNavigation from '../components/HorizontalNavigation'

export const PRIVATE_TYPE = ['history', 'inspiration']
export const USER_PAGE_MENU = [
  { name: 'inspiration.page.title', url: 'inspiration' },
  { name: 'likes.page.title', url: 'likes' },
  { name: 'collection.page.title', url: 'collections' },
  { name: 'history.page.title', url: 'history' },
]

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation('common')
  const authUser = useRecoilValue(authUserState)

  const userPageMenu: { name: string; url: string }[] = []
  USER_PAGE_MENU.forEach(({ name, url }) => {
    userPageMenu.push({
      name: t(name),
      url: url,
    })
  })

  return (
    <>
      {authUser && (
        <div className="flex-grow h-full w-full flex flex-col bg-white">
          <div className={clsx('w-full my-8 flex flex-col justify-center items-center')}>
            <img src={authUser?.avatar} className="h-24 w-24 rounded-full" />
            <div className="flex-grow font-bold text-xl py-2 flex flex-col justify-center">
              {authUser && authUser.nickname}
            </div>
          </div>

          <div className="mx-4 lg:mx-auto">
            <HorizontalNavigation routes={userPageMenu} urlPrefix={`/user`} />
          </div>

          <div className="flex-grow flex flex-col p-4 lg:p-8">{children}</div>
        </div>
      )}
    </>
  )
}

export default UserLayout
