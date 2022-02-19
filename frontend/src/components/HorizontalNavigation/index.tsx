import React from 'react'
import { useLocation, history } from 'umi'
import clsx from 'clsx'

const HorizontalNavigation: React.FC<{
  routes: { name: string; url: string }[]
  urlPrefix: string
}> = ({ routes, urlPrefix }) => {
  const location = useLocation()

  return (
    <div className="w-full flex flex-row space-x-2">
      {routes.map(({ name, url }, index) => (
        <div
          key={index}
          className={clsx('text-md btn font-bold', {
            'btn-primary':
              location.pathname === `${urlPrefix}/${url}` ||
              location.pathname === `${urlPrefix}/${url}/`,
            // 'btn-gray':
            //   location.pathname !== `${urlPrefix}/${url}` &&
            //   location.pathname !== `${urlPrefix}/${url}/`,
          })}
          onClick={() => {
            history.push(`${urlPrefix}/${url}`)
          }}
        >
          {name}
        </div>
      ))}
    </div>
  )
}

export default HorizontalNavigation
