import React, { useState, useEffect } from 'react'
import { history, useSelector, useDispatch, useIntl, useLocation } from 'umi'
import { AuthModelState } from '@/models/auth'
import clsx from 'clsx'

const DropdownItem = ({
  message,
  handleClick,
}: {
  message: string
  handleClick: () => void
}) => {
  return (
    <div
      className="w-full hover:bg-gray-100 p-4 text-md cursor-pointer transition-all duration-200 ease-in-out"
      onClick={handleClick}
    >
      {message}
    </div>
  )
}

const UserDropdown: React.FC = () => {
  const intl = useIntl()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector(({ auth }: { auth: AuthModelState }) => auth)
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)

  let timer: NodeJS.Timeout | null = null

  const onMouseEnter = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    setDropdownVisible(true)
  }

  const onMouseLeave = () => {
    timer = setTimeout(() => {
      setDropdownVisible(false)
    }, 200)
  }

  useEffect(() => {
    setDropdownVisible(false)
  }, [location.pathname])

  return (
    <div className="relative h-full flex flex-col justify-center z-10">
      <div className="h-full flex justify-end relative">
        <img
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          src={user?.avatar}
          className="w-16 p-4 rounded-full cursor-pointer"
        />
      </div>

      <div
        className={clsx('absolute w-72 top-16 right-0 mt-2', {
          hidden: !dropdownVisible,
        })}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="shadow flex flex-col py-4 rounded-lg bg-white divide-y divide-gray-200">

          <div className="">
            <DropdownItem
              message={intl.formatMessage({
                id: 'site.routes.user_profile',
              })}
              handleClick={() => {
                history.push(`/user/${user?.username}/inspiration`)
              }}
            />
            <DropdownItem
              message={intl.formatMessage({ id: 'site.routes.user_update' })}
              handleClick={() => {
                history.push('/account/profile')
              }}
            />
            <DropdownItem
              message={intl.formatMessage({ id: 'site.routes.user_password' })}
              handleClick={() => {
                history.push('/account/password')
              }}
            />
          </div>

          <DropdownItem
            message={intl.formatMessage({ id: 'auth.sign_out' })}
            handleClick={() => {
              dispatch({ type: 'auth/signOut' })
              window.location.reload()
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default UserDropdown
