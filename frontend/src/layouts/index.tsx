import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect } from 'react'
import { useGetUser } from '../queries/auth'
import { AuthLayout } from './auth'
import { BasicLayout } from './basic'

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter()
  const { t } = useTranslation('common')

  useGetUser()

  let childrenWithLayout: ReactNode

  if (router.pathname.startsWith('/auth')) {
    childrenWithLayout = <AuthLayout>{children}</AuthLayout>
  } else {
    childrenWithLayout = <BasicLayout>{children}</BasicLayout>
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <Head>
        <title>{t('site.name')}</title>
      </Head>
      {childrenWithLayout}
    </div>
  )
}

export default Layout
