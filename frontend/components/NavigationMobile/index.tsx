import React, { useState, useEffect, useMemo, Fragment } from 'react'
import {
  Link,
  useIntl,
  history,
  useSelector,
  useDispatch,
  useLocation,
} from 'umi'
import { AuthModelState } from '@/models/auth'
import { Search, Menu, Close } from '@/components/Icons'
import clsx from 'clsx'
import {
  ROUTES,
  APP_ICON_URL,
} from '@/constants'
import { GlobalLoadingState } from '@/utils'
import { isiOS as isiOSService } from '@/utils/device'
import { Logo } from '../Images'

const MenuItem: React.FC<{
  message: string
  handleClick: () => void
}> = ({ message, handleClick }) => {
  return (
    <div
      className={clsx(
        'w-full hover-bg-gray-100 p-4 text-md cursor-pointer',
        'transition-all duration-200 ease-in-out',
      )}
      onClick={handleClick}
    >
      {message}
    </div>
  )
}

const NavigationMobile: React.FC = () => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const location = useLocation()
  const { user } = useSelector(({ auth }: { auth: AuthModelState }) => auth)
  const globalLoading = useSelector(
    ({ loading }: { loading: GlobalLoadingState }) => loading,
  )
  const [menuVisible, setMenuVisible] = useState(false)

  const isiOS = useMemo(() => {
    return isiOSService()
  }, [])

  const loading = globalLoading.models.auth

  useEffect(() => {
    setMenuVisible(false)
  }, [location.pathname])

  useEffect(() => {
    if (menuVisible) {
      document.body.classList.add('overflow-y-hidden')
    } else {
      document.body.classList.remove('overflow-y-hidden')
    }
  }, [menuVisible])

  return (
    <div className="w-full z-10 lg:hidden">
      <div className="w-full h-16 px-4 grid grid-cols-3 shadow relative z-20">
        <div className="h-16 flex flex-row justify-start">
          {!loading && user && (
            <div
              className="w-10 h-full py-5 px-2 text-gray-500"
              onClick={() => {
                setMenuVisible(!menuVisible)
              }}
            >
              {menuVisible ? <Close /> : <Menu />}
            </div>
          )}

          {!loading && !user && (
            <div
              className="h-16 flex flex-col p-2 justify-center"
              onClick={() => {
                history.push('/auth/phone')
              }}
            >
              {intl.formatMessage({ id: 'auth.sign_in' })}
            </div>
          )}
        </div>

        <div className="flex flex-row justify-center">
          <Logo
            className="h-16 py-5 px-2 object-fill cursor-pointer"
            onClick={() => {
              history.push('/')
            }}
          />
        </div>

        <div className="flex flex-row justify-end">
          <div
            className="w-10 h-16 py-5 px-2 text-gray-500"
            onClick={() => {
              history.push('/search/projects')
            }}
          >
            <Search />
          </div>
        </div>
      </div>

      {/* navigate to app store */}
      {location.pathname === '/' && (
        <div className="w-full h-16 py-4 px-4 flex justify-between bg-gray-200">
          <div className="h-full flex flex-col justify-center">
            <div className="flex h-full">
              <img className="rounded-lg w-auto h-full" src={APP_ICON_URL} />

              <div className="flex flex-col justify-center pl-2">
                <div className="font-bold text-sm">
                  {intl.formatMessage({ id: 'app.name' })}
                </div>
                <div className="text-xs">
                  {intl.formatMessage({ id: 'app.desc' })}
                </div>
              </div>
            </div>
          </div>

          <div className="h-full flex flex-col justify-center">
            <a
              className="btn btn-primary btn-small text-sm"
              href={'https://ai.tezign.com/api/download'}
            >
              {intl.formatMessage({ id: 'app.download' })}
            </a>
          </div>
        </div>
      )}

      <div
        className={clsx(
          { hidden: !menuVisible },
          'fixed top-0 left-0 right-0 bottom-0 pt-16',
          'h-screen w-screen',
        )}
      >
        <div
          className="h-full bg-white overflow-y-scroll divide-y divide-y-200 flex flex-col"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <div className="w-full flex flex-col">
            {ROUTES.map(({ name, path, visibleOnMobile }, index) => (
              <Fragment key={index}>
                {
                  visibleOnMobile && (
                    <Link
                      className={clsx('link w-full p-4', {
                        'link-active':
                          location.pathname === path ||
                          location.pathname === `${path}/`,
                      })}
                      to={path}
                    >
                      {intl.formatMessage({ id: name })}
                    </Link>
                  )
                }
              </Fragment>
            ))}
          </div>

          {!!user && (
            <div className="w-full">

              <MenuItem
                message={intl.formatMessage({
                  id: 'site.routes.user_profile',
                })}
                handleClick={() => {
                  history.push(`/user/${user?.username}/inspiration`)
                }}
              />
              <MenuItem
                message={intl.formatMessage({ id: 'site.routes.user_update' })}
                handleClick={() => {
                  history.push('/account/profile')
                }}
              />
              <MenuItem
                message={intl.formatMessage({ id: 'site.routes.user_password' })}
                handleClick={() => {
                  history.push('/account/password')
                }}
              />
              <MenuItem
                message={intl.formatMessage({ id: 'auth.sign_out' })}
                handleClick={() => {
                  dispatch({ type: 'auth/signOut' })
                  window.location.reload()
                }}
              />
            </div>
          )}

          {!user && (
            <div className="w-full">
              <MenuItem
                message={intl.formatMessage({ id: 'auth.sign_in' })}
                handleClick={() => {
                  history.push('/auth/sign-in')
                }}
              />
              <MenuItem
                message={intl.formatMessage({ id: 'auth.sign_up' })}
                handleClick={() => {
                  history.push('/auth/sign-up')
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NavigationMobile