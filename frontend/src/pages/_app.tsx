import { ACCESS_TOKEN_NAME, STATIC_URL } from '@/constants/index'
import Layout from '@/layouts'
import axios from 'axios'
import type { NextPage } from 'next'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { RecoilRoot } from 'recoil'
import '../global.css'

// add axios interceptor to set the authorization header
axios.interceptors.request.use((config) => {
  if (typeof window === 'undefined') {
    // on server side, change the request url to backend service
    config.baseURL = 'https://vecflow.com'
    return config
  }

  const token = localStorage.getItem(ACCESS_TOKEN_NAME)
  if (token && config.headers && !config.url?.startsWith(STATIC_URL)) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
})

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
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
      </QueryClientProvider>
    </RecoilRoot>
  )
}

export default appWithTranslation(MyApp)
