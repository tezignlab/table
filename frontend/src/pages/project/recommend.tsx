import ProjectList from '@/components/ProjectList'
import { getProjects, getRecommendProjects } from '@/services/project'
import { authStatusState, currentUserStatusState } from '@/stores/auth'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import Banner from '@/components/Banner'
import { ROUTES } from '@/constants'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? '')),
    },
  }
}
export default function RecommendPage() {
  const { t } = useTranslation('common')

  const router = useRouter()

  const pageHeader = useMemo(() => {
    let value = undefined
    ROUTES.forEach((route) => {
      if (route.path === router.pathname || `${route.path}/` === router.pathname) {
        value = t(route.name)
      }
    })

    return value
  }, [router.pathname])

  const authUser = useRecoilValue(currentUserStatusState)
  const authStatus = useRecoilValue(authStatusState)

  return (
    <div className="w-full h-full">
      {authStatus.requested && !authUser && <Banner />}
      <Head>
        <meta charSet="utf-8" />
        <title>{`${t('auth.welcome')} | ${t('site.name')}`}</title>
      </Head>

      <div className="w-full h-full bg-white">
        <div className="lg:hidden w-full py-6 text-center text-lg font-bold">{pageHeader}</div>

        <ProjectList name="recommendProjects" loadMore={getRecommendProjects} />
      </div>
    </div>
  )
}
