import { useTranslation } from 'next-i18next'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AuthModelState } from '../../../models/auth'
import { ProjectModelState } from '../../../models/project'
import { GlobalLoadingState } from '../../../utils'
import Head from 'next/head'
// import {
//   useIntl,
//   Helmet,
//   useSelector,
//   useDispatch,
//   useParams,
//   history,
// } from 'umi'
import { CurrentUserModelState } from '../../../models/currentUser'
import { PRIVATE_TYPE } from '../../../layouts/user'
import ProjectList from '../../../components/ProjectList'
import { SHOT_LIST_PAGE_SIZE } from '../../../constants'

const UserProjectsPage: React.FC = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { type, username } = router.query as { type: string; username: string }
  const { user } = useSelector(
    ({ currentUser }: { currentUser: CurrentUserModelState }) => currentUser,
  )
  const { user: authUser } = useSelector(
    ({ auth }: { auth: AuthModelState }) => auth,
  )
  const { count } = useSelector(
    ({ project }: { project: ProjectModelState }) => project,
  )

  const globalLoading = useSelector(
    ({ loading }: { loading: GlobalLoadingState }) => loading,
  )

  const dispatch = useDispatch()

  useEffect(() => {
    if (
      user &&
      authUser &&
      !(user.id === authUser.id) &&
      PRIVATE_TYPE.indexOf(type) !== -1
    ) {
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

export default UserProjectsPage
