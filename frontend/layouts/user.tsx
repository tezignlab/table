import React, { useEffect } from 'react'
// import { useSelector, useIntl, useParams, useDispatch } from 'umi'
import { AuthModelState } from '../models/auth'
import { CurrentUserModelState } from '../models/currentUser'
import Layout from './basic'
import clsx from 'clsx'
import { Loading } from '../components/Icons'
import NotFound from '../components/NotFound'
import HorizontalNavigation from '../components/HorizontalNavigation'
import { GlobalLoadingState } from '../utils'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

export const PRIVATE_TYPE = ['history', 'inspiration']
export const USER_PAGE_MENU = [
  { name: 'inspiration.page.title', url: 'inspiration' },
  { name: 'likes.page.title', url: 'likes' },
  { name: 'collection.page.title', url: 'collections' },
  { name: 'history.page.title', url: 'history' },
]

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, error } = useSelector(
    ({ currentUser }: { currentUser: CurrentUserModelState }) => currentUser,
  )
  const { user: authUser } = useSelector(
    ({ auth }: { auth: AuthModelState }) => auth,
  )
  const loading = useSelector(
    ({ loading }: { loading: GlobalLoadingState }) => loading,
  )
  const { t } = useTranslation('common')
  const router = useRouter()
  const { username } = router.query as { username: string }
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'currentUser/clear' })
    dispatch({
      type: 'currentUser/getCurrentUser',
      payload: { username: username },
    })
  }, [username])

  const userPageMenu: { name: string; url: string }[] = []
  USER_PAGE_MENU.forEach(({ name, url }) => {
    userPageMenu.push({
      name: t(name),
      url: url,
    })
  })

  return (
    <Layout>
      {!(loading.models.auth && loading.models.currentUser) && !error && user && (
        <div className="flex-grow h-full w-full flex flex-col bg-white">
          <div
            className={clsx(
              'w-full my-8 flex flex-col justify-center items-center',
            )}
          >
            <img src={user?.avatar} className="h-24 w-24 rounded-full" />
            <div className="flex-grow font-bold text-xl py-2 flex flex-col justify-center">
              {user && user.nickname}
            </div>
          </div>

          <div className="mx-auto">
            <HorizontalNavigation
              routes={userPageMenu}
              urlPrefix={`/user/${username}`}
            />
          </div>

          <div className="flex-grow flex flex-col p-8">{children}</div>
        </div>
      )}

      {!(loading.models.auth && loading.models.currentUser) && error && (
        <NotFound />
      )}

      {loading.models.auth && loading.models.currentUser && !error && (
        <div className="flex-grow h-full mx-auto w-6 flex flex-col justify-center">
          <Loading />
        </div>
      )}
    </Layout>
  )
}

export default UserLayout
