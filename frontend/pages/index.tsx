import { useTranslation } from 'next-i18next'
import React, { useEffect, useMemo } from 'react'
// import { Helmet, useIntl, useDispatch, useSelector, useLocation } from 'umi'
import { ProjectModelState } from '../models/project'
import ProjectList from '../components/ProjectList'
import { SHOT_LIST_PAGE_SIZE, ROUTES } from '../constants'
import Banner from '../components/Banner'
import { AuthModelState } from '../models/auth'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? '')),
    },
  }
}
const IndexPage: React.FC = () => {
  const { t } = useTranslation('common')

  const dispatch = useDispatch()
  const router = useRouter()

  const { count } = useSelector(
    ({ project }: { project: ProjectModelState }) => project,
  )
  const pageHeader = useMemo(() => {
    let value = undefined
    ROUTES.forEach((route) => {
      if (
        route.path === router.pathname ||
        `${route.path}/` === router.pathname
      ) {
        value = t('route.name')
      }
    })

    return value
  }, [router.pathname])
  const { requested, user } = useSelector(
    ({ auth }: { auth: AuthModelState }) => auth,
  )
  useEffect(() => {
    dispatch({ type: 'project/clear' })
  }, [])

  return (
    <div className="w-full h-full">
      {requested && !user && <Banner />}
      <Head>
        <meta charSet="utf-8" />
        <title>{`${t('auth.welcome')} | ${t('site.name')}`}</title>
      </Head>

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
                type: router.pathname.includes('/project/recommend')
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
