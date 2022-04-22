import Layout from '../components/layouts/index'
import type { NextPage } from 'next'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import React from 'react'
import '../global.css'
import { RecoilRoot } from 'recoil'
import BasicLayout from '@/components/layouts/basic'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <RecoilRoot>
      <BasicLayout>{getLayout(<Component {...pageProps} />)}</BasicLayout>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default appWithTranslation(MyApp)
