import React from 'react'
import { useIntl, Helmet } from 'umi'
import { STATIC_URL } from '@/constants'

const NotFound: React.FC = () => {
  const intl = useIntl()

  return (
    <div className="flex-grow w-full h-full p-8 flex flex-col justify-center">
      <Helmet>
        <title>{`${intl.formatMessage({
          id: 'general.404',
        })} - ${intl.formatMessage({
          id: 'site.name',
        })}`}</title>
      </Helmet>

      <div className="mx-auto w-48 lg:w-72">
        <img
          className="object-fit"
          src={`${STATIC_URL}/404.png`}
          alt="not-found"
        />
      </div>
    </div>
  )
}

export default NotFound
