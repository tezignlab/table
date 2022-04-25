import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect } from 'react'
import UserLayout, { PRIVATE_TYPE } from '../../../components/layouts/user'
import ProjectList from '../../../components/ProjectList'
import { SHOT_LIST_PAGE_SIZE } from '../../../constants'
import { AuthModelState } from '../../../models/auth'
import { CurrentUserModelState } from '../../../models/currentUser'
import { ProjectModelState } from '../../../models/project'
import { GlobalLoadingState } from '../../../utils'
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? '')),
    },
  }
}
export default function UserProjectsPage() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { type, username } = router.query as { type: string; username: string }
  const { user } = useSelector(({ currentUser }: { currentUser: CurrentUserModelState }) => currentUser)
  const { user: authUser } = useSelector(({ auth }: { auth: AuthModelState }) => auth)
  const { count } = useSelector(({ project }: { project: ProjectModelState }) => project)

  const globalLoading = useSelector(({ loading }: { loading: GlobalLoadingState }) => loading)

  const dispatch = useDispatch()

  useEffect(() => {
    if (user && authUser && !(user.id === authUser.id) && PRIVATE_TYPE.indexOf(type) !== -1) {
      router.push(`/user/${username}`)
    }
  }, [globalLoading.models.currentUser, globalLoading.models.auth])

  useEffect(() => {
    dispatch({ type: 'project/clear' })
  }, [])

  return (
    <div className="flex-grow w-full min-h-0 bg-white">
      <Head>
        <title>{`${user?.username}${t(`${type}.page.title`)}`}</title>
      </Head>
      <div className="bg-white">
        <ProjectList
          loadMore={() => {
            dispatch({
              type: 'project/getProjects',
              payload: {
                skip: count,
                limit: SHOT_LIST_PAGE_SIZE,
                userId: user?.id,
                type: type,
              },
            })
          }}
        />
      </div>
    </div>
  )
}
UserProjectsPage.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>
}
