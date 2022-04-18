import React, { useEffect } from 'react'
import {
  useIntl,
  Helmet,
  useSelector,
  useDispatch,
  useParams,
  history,
} from 'umi'
import ProjectList from '@/components/ProjectList'
import { CurrentUserModelState } from '@/models/currentUser'
import { AuthModelState } from '@/models/auth'
import { ProjectModelState } from '@/models/project'
import { GlobalLoadingState } from '@/utils'
import { SHOT_LIST_PAGE_SIZE } from '@/constants'
import { PRIVATE_TYPE } from '@/layouts/user'

const UserProjectsPage: React.FC = () => {
  const intl = useIntl()
  const { type, username } = useParams<{ type: string; username: string }>()
  const { user } = useSelector(
    ({ currentUser }: { currentUser: CurrentUserModelState }) => currentUser,
  )
  const { user: authUser } = useSelector(
    ({ auth }: { auth: AuthModelState }) => auth,
  )
  const { count } = useSelector(({ project }: { project: ProjectModelState }) => project)

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
      history.push(`/user/${username}`)
    }
  }, [globalLoading.models.currentUser, globalLoading.models.auth])

  useEffect(() => {
    dispatch({ type: 'project/clear' })
  }, [])

  return (
    <div className="flex-grow w-full min-h-0 bg-white">
      <Helmet>
        <title>{`${user?.username}${intl.formatMessage({
          id: `${type}.page.title`,
        })}`}</title>
      </Helmet>
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
