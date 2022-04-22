import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect } from 'react'
import { AuthModelState } from '../../models/auth'

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { t } = useTranslation('common')
  const { requested } = useSelector(
    ({ auth }: { auth: AuthModelState }) => auth,
  )
  useEffect(() => {
    if (!requested) {
      dispatch({ type: 'auth/getUser' })
    }
  }, [])

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
