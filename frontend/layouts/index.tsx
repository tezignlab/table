import React, { ReactNode, useEffect } from 'react'
import {
  useDispatch,
  useLocation,
  useSelector,
  Helmet,
  useIntl,
} from 'umi'
import { AuthModelState } from '@/models/auth'

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const intl = useIntl()
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
  }, [location.pathname])

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <Helmet>
        <title>{intl.formatMessage({ id: 'site.name' })}</title>
      </Helmet>
      {children}
    </div>
  )
}

export default Layout
