import { authStatusState } from '@/stores/auth'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { useGetUser } from '../../queries/auth'

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter()
  const { t } = useTranslation('common')

  useGetUser()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [router.pathname])

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <Head>
        <title>{t('site.name')}</title>
      </Head>
      {children}
    </div>
  )
}

export default Layout
