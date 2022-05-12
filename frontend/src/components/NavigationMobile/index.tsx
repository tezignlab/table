import { signOut } from '@/services/auth'
import { authUserState } from '@/stores/auth'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { ROUTES } from '../../constants'
import { Close, Menu, Search } from '../Icons'
import { Logo } from '../Images'

const MenuItem: React.FC<{
  message: string
  handleClick: () => void
}> = ({ message, handleClick }) => {
  return (
    <div
      className={clsx('w-full hover-bg-gray-100 p-4 text-md cursor-pointer', 'transition-all duration-200 ease-in-out')}
      onClick={handleClick}
    >
      {message}
    </div>
  )
}

const NavigationMobile: React.FC = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [menuVisible, setMenuVisible] = useState(false)
  const authUser = useRecoilValue(authUserState)

  // const isiOS = useMemo(() => {
  //   return isiOSService()
  // }, [])

  useEffect(() => {
    setMenuVisible(false)
  }, [router.pathname])

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
          {authUser && (
            <div
              className="w-10 h-full py-5 px-2 text-gray-500"
              onClick={() => {
                setMenuVisible(!menuVisible)
              }}
            >
              {menuVisible ? <Close /> : <Menu />}
            </div>
          )}

          {!authUser && (
            <div
              className="h-16 flex flex-col p-2 justify-center"
              onClick={() => {
                router.push('/auth/sign-in')
              }}
            >
              {t('auth.sign_in')}
            </div>
          )}
        </div>

        <div className="flex flex-row justify-center">
          <Logo
            className="h-16 py-5 px-2 object-fill cursor-pointer"
            onClick={() => {
              router.push('/')
            }}
          />
        </div>

        <div className="flex flex-row justify-end">
          <div
            className="w-10 h-16 py-5 px-2 text-gray-500"
            onClick={() => {
              router.push('/search')
            }}
          >
            <Search />
          </div>
        </div>
      </div>

      <div className={clsx({ hidden: !menuVisible }, 'fixed top-0 left-0 right-0 bottom-0 pt-16', 'h-screen w-screen')}>
        <div
          className="h-full bg-white overflow-y-scroll divide-y divide-y-200 flex flex-col"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <div className="w-full flex flex-col">
            {ROUTES.map(({ name, path, visibleOnMobile }) => (
              <Fragment key={name}>
                {visibleOnMobile && (
                  <Link href={path}>
                    <a
                      className={clsx('link w-full p-4', {
                        'link-active': router.pathname === path || router.pathname === `${path}/`,
                      })}
                    >
                      {t(name)}
                    </a>
                  </Link>
                )}
              </Fragment>
            ))}
          </div>

          {!!authUser && (
            <div className="w-full">
              <MenuItem
                message={t('site.routes.user_profile')}
                handleClick={() => {
                  router.push(`/user/inspiration`)
                }}
              />
              <MenuItem
                message={t('site.routes.user_update')}
                handleClick={() => {
                  router.push('/account/profile')
                }}
              />
              <MenuItem
                message={t('site.routes.user_password')}
                handleClick={() => {
                  router.push('/account/password')
                }}
              />
              <MenuItem
                message={t('auth.sign_out')}
                handleClick={() => {
                  signOut()
                  window.location.reload()
                }}
              />
            </div>
          )}

          {!authUser && (
            <div className="w-full">
              <MenuItem
                message={t('auth.sign_in')}
                handleClick={() => {
                  router.push('/auth/sign-in')
                }}
              />
              <MenuItem
                message={t('auth.sign_up')}
                handleClick={() => {
                  router.push('/auth/sign-up')
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
