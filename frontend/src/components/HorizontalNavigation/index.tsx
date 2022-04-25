import clsx from 'clsx'
import { useRouter } from 'next/router'
import React from 'react'

const HorizontalNavigation: React.FC<{
  routes: { name: string; url: string }[]
  urlPrefix: string
}> = ({ routes, urlPrefix }) => {
  const router = useRouter()

  return (
    <div className="w-full flex flex-row space-x-2">
      {routes.map(({ name, url }, index) => (
        <div
          key={index}
          className={clsx('text-md btn font-bold', {
            'btn-primary': router.pathname === `${urlPrefix}/${url}` || router.pathname === `${urlPrefix}/${url}/`,
          })}
          onClick={() => {
            router.push(`${urlPrefix}/${url}`)
          }}
        >
          {name}
        </div>
      ))}
    </div>
  )
}

export default HorizontalNavigation
