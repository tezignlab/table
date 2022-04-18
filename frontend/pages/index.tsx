import { useTranslation } from 'next-i18next'
import React, { useEffect, useMemo } from 'react'
// import { Helmet, useIntl, useDispatch, useSelector, useLocation } from 'umi'
import { ProjectModelState } from '../models/project'
import ProjectList from '../components/ProjectList'
import { SHOT_LIST_PAGE_SIZE, ROUTES } from '../constants'
import Banner from '../components/Banner'
import { AuthModelState } from '../models/auth'

const IndexPage: React.FC = () => {
  // const intl = useIntl()
  const { t } = useTranslation('common')

  const dispatch = useDispatch()
  const location = useLocation()

  const { count } = useSelector(
    ({ project }: { project: ProjectModelState }) => project,
  )
  const pageHeader = useMemo(() => {
    let value = undefined
    ROUTES.forEach((route) => {
      if (
        route.path === location.pathname ||
        `${route.path}/` === location.pathname
      ) {
        value = t('route.name')
      }
    })

    return value
  }, [location.pathname])
  const { requested, user } = useSelector(
    ({ auth }: { auth: AuthModelState }) => auth,
  )
  useEffect(() => {
    dispatch({ type: 'project/clear' })
  }, [])

  return (
    <div className="w-full h-full">
      {requested && !user && <Banner />}
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          {`${intl.formatMessage({
            id: 'auth.welcome',
          })} | ${intl.formatMessage({ id: 'site.name' })}`}
        </title>
      </Helmet>

      <div className="w-full h-full bg-white">
        <div className="lg:hidden w-full py-6 text-center text-lg font-bold">
          {pageHeader}
        </div>

        <ProjectList
          loadMore={() => {
            dispatch({
              type: 'project/getProjects',
              payload: {
                skip: count,
                limit: SHOT_LIST_PAGE_SIZE,
                type: location.pathname.includes('/project/recommend')
                  ? 'recommend'
                  : 'all',
              },
            })
          }}
        />
      </div>
    </div>
  )
}

export default IndexPage
