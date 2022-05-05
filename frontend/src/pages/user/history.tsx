import ProjectList from '@/components/ProjectList'
import UserLayout from '@/layouts/user'
import { getViewedProjectsList } from '@/services/project'
import { authUserState } from '@/stores/auth'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import React, { ReactElement, useCallback } from 'react'
import { useRecoilValue } from 'recoil'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? '')),
    },
  }
}

export default function UserProjectsPage() {
  const { t } = useTranslation('common')
  const authUser = useRecoilValue(authUserState)

  const loadMore = useCallback(async ({ skip, limit }: { skip: number; limit: number }) => {
    const result = await getViewedProjectsList(skip, limit)
    return result
  }, [])

  return (
    <div className="flex-grow w-full min-h-0 bg-white">
      <Head>
        <title>{`${authUser?.username}${t(`history.page.title`)}`}</title>
      </Head>
      <div className="bg-white">
        <ProjectList name={`${authUser?.id}-viewedProjects`} loadMore={loadMore} />
      </div>
    </div>
  )
}

UserProjectsPage.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>
}
