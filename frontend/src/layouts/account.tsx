import { authStatusState, authUserState } from '@/stores/auth'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { notification } from '../components/Notification'

const AccountLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation('common')
  const router = useRouter()

  const authStatus = useRecoilValue(authStatusState)
  const authUser = useRecoilValue(authUserState)

  useEffect(() => {
    if (authStatus.requested && !authUser) {
      router.push('/')
    }
  }, [authUser])

  useEffect(() => {
    if (authStatus.error) {
      notification('error', t(authStatus.message ?? ''), 1000)
      // TODO dispatch({ type: 'auth/clearNotification' })
    }

    if (authStatus.success && !!authStatus.message) {
      notification('success', t(authStatus.message), 1000)
      // TODO dispatch({ type: 'auth/clearNotification' })
    }
  }, [authStatus.error, authStatus.success])

  return (
    <>
      <Head>
        <title>{t('site.routes.user_profile')}</title>
      </Head>
      <div className="max-w-screen-lg w-full h-full p-4 mx-auto flex space-x-4 my-16">{children}</div>
    </>
  )
}

export default AccountLayout
