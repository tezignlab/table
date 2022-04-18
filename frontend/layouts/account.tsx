import React, { useEffect } from 'react'
import {
  useSelector,
  useIntl,
  history,
  useDispatch,
  Helmet,
} from 'umi'
import { AuthModelState } from '@/models/auth'
import { GlobalLoadingState } from '@/utils'
import { notification } from '@/components/Notification'
import Layout from '@/layouts/basic'

const AccountLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const intl = useIntl()
  const dispatch = useDispatch()

  const auth = useSelector(({ auth }: { auth: AuthModelState }) => auth)
  const globalLoading = useSelector(
    ({ loading }: { loading: GlobalLoadingState }) => loading,
  )

  const authLoading = globalLoading.models.auth

  useEffect(() => {
    if (auth.requested && !authLoading && !auth.user) {
      history.push('/')
    }
  }, [authLoading, auth.user])

  useEffect(() => {
    if (auth.error) {
      notification('error', intl.formatMessage({ id: auth.message }), 1000)
      dispatch({ type: 'auth/clearNotification' })
    }

    if (auth.success && !!auth.message) {
      notification('success', intl.formatMessage({ id: auth.message }), 1000)
      dispatch({ type: 'auth/clearNotification' })
    }
  }, [auth.error, auth.success])

  return (
    <Layout>
      <Helmet>
        <title>{intl.formatMessage({ id: 'site.routes.user_profile' })}</title>
      </Helmet>
      <div className="max-w-screen-lg w-full h-full p-4 mx-auto flex space-x-4 lg:space-x-32 my-16">
        <div className="flex-grow">{children}</div>
      </div>
    </Layout>
  )
}

export default AccountLayout
