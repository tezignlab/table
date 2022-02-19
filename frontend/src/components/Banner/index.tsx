import React from 'react'
import { useIntl, history } from 'umi'
import { MainBanner } from '../Images'

const Banner: React.FC = () => {
  const intl = useIntl()
  return (
    <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 text-gray-600">
      <div className="justify-center mx-auto lg:justify-self-end my-12 lg:mr-36 2xl:my-20 2xl:mr-60">
        <div className="text-3xl 2xl:text-4xl py-2">
          {intl.formatMessage({ id: 'publicity.slogan' })}
        </div>
        <div className="text-xl 2xl:text-2xl py-1 mt-2">
          {intl.formatMessage({ id: 'publicity.introduction' })}
        </div>
        <div className="pt-8 2xl:pt-10">
          <button
            className="btn btn-primary"
            onClick={() => {
              history.push('/auth/sign-in')
            }}
          >
            Github
          </button>
        </div>
      </div>
      <div className="justify-center w-1/2 mx-auto lg:m-6 m-6">
        <MainBanner className="w-full h-full object-contain" />
      </div>
    </div>
  )
}

export default Banner
