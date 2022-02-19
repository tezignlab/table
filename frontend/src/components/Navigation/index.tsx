import React, { useState } from 'react'
import { Link, useIntl, history, useSelector, useLocation } from 'umi'
import { ROUTES } from '@/constants'
import { AuthModelState } from '@/models/auth'
import { GlobalLoadingState } from '@/utils'
import UserDropdown from '@/components/UserDropdown'
import { Search } from '@/components/Icons'
import clsx from 'clsx'
import { Logo } from '../Images'

const Navigation: React.FC = () => {
  const intl = useIntl()
  const location = useLocation()

  const auth = useSelector(({ auth }: { auth: AuthModelState }) => auth)
  const [searchValue, setSearchValue] = useState('')
  const globalLoading = useSelector(
    ({ loading }: { loading: GlobalLoadingState }) => loading,
  )

  const authLoading = globalLoading.models.auth

  return (
    <div className="w-full h-16 bg-white px-6 flex-row justify-between shadow hidden lg:flex">
      <div className="w-1/3 px-4 py-5 flex justify-start">
        <Logo
          className="h-full object-fill cursor-pointer"
          onClick={() => {
            history.push('/')
          }}
        />

        <div className="pl-8 h-full w-full mx-auto space-x-4 flex flex-row">
          {ROUTES.map(({ name, path }, index) => (
            <Link
              className={clsx('link text-md flex flex-col justify-center', {
                'link-active':
                  location.pathname === path ||
                  location.pathname === `${path}/`,
              })}
              key={index}
              to={path}
            >
              {intl.formatMessage({ id: name })}
            </Link>
          ))}
        </div>
      </div>

      <div className="w-1/3 flex flex-col justify-center px-4">
        {!location.pathname.startsWith('/search') && (
          <div className="mx-auto flex flex-col justify-center w-full max-w-md relative">
            <input
              className={clsx(
                'w-full flex-grow pr-6 py-2 pl-12',
                'text-gray-500 placeholder-gray-500 border-gray-100 text-md',
                'border-2 bg-gray-100 outline-none',
                'rounded-lg transition-all duration-200 ease-in-out',
                'focus:border-gray-500 focus:placeholder-transparent focus:bg-white',
                'hover:border-gray-400 hover:bg-white',
              )}
              placeholder={intl.formatMessage({ id: 'search.projects' })}
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  history.push(
                    `/search/projects/${encodeURIComponent(searchValue)}`,
                  )
                }
              }}
            />

            <div className="absolute h-6 w-6 top-2 ml-3 text-gray-300">
              <Search />
            </div>
          </div>
        )}
      </div>

      <div className="w-1/3 flex justify-end space-x-2">
        <div className="flex-none h-full flex flex-col justify-center">
          {!authLoading && !auth.user && (
            <div className="w-full space-x-2 flex justify-end">
              <button
                className="btn text-sm py-2"
                onClick={() => {
                  history.push('/auth/sign-in')
                }}
              >
                {intl.formatMessage({ id: 'auth.sign_in' })}
              </button>

              <button
                className="btn btn-primary text-sm py-2"
                onClick={() => {
                  history.push('/auth/sign-up')
                }}
              >
                {intl.formatMessage({ id: 'auth.sign_up' })}
              </button>
            </div>
          )}

          {!authLoading && !!auth.user && (
            <div className="w-full flex flex-row justify-end">
              <UserDropdown />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navigation
