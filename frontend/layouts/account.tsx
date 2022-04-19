import React, { useEffect } from 'react'
// import { useSelector, useIntl, history, useDispatch, Helmet } from 'umi'
import { AuthModelState } from '../models/auth'
import { GlobalLoadingState } from '../utils'
import { notification } from '../components/Notification'
import Layout from './basic'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Head from 'next/head'

const AccountLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const dispatch = useDispatch()

  const auth = useSelector(({ auth }: { auth: AuthModelState }) => auth)
  const globalLoading = useSelector(
    ({ loading }: { loading: GlobalLoadingState }) => loading,
  )

  const authLoading = globalLoading.models.auth

  useEffect(() => {
    if (auth.requested && !authLoading && !auth.user) {
      router.push('/')
    }
  }, [authLoading, auth.user])

  useEffect(() => {
    if (auth.error) {
      notification('error', t(auth.message), 1000)
      dispatch({ type: 'auth/clearNotification' })
    }

    if (auth.success && !!auth.message) {
      notification('success', t(auth.message), 1000)
      dispatch({ type: 'auth/clearNotification' })
    }
  }, [auth.error, auth.success])

  return (
    <Layout>
      <Head>
        <title>{t('site.routes.user_profile')}</title>
      </Head>
      <div className="max-w-screen-lg w-full h-full p-4 mx-auto flex space-x-4 lg:space-x-32 my-16">
        <div className="flex-grow">{children}</div>
      </div>
    </Layout>
  )
}

export default AccountLayout
