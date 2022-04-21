import Layout from '../components/layouts/index'
import type { NextPage } from 'next'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import { RecoilRoot } from 'recoil'
import React from 'react'
import '../styles/global.css'

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
      <Layout>
        {getLayout(<Component {...pageProps} />)}
      </Layout>
    </RecoilRoot>
  )
}

export default appWithTranslation(MyApp)
