import React from 'react'
import { useSelector } from 'umi'
import Navigation from '@/components/Navigation'
import NavigationMobile from '@/components/NavigationMobile'
import { AuthModelState } from '@/models/auth'
import { GlobalLoadingState } from '@/utils'
import Footer from '@/components/Footer'
import Layout from '@/layouts/index'

const BasicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { requested } = useSelector(
    ({ auth }: { auth: AuthModelState }) => auth,
  )

  const globalLoading = useSelector(
    ({ loading }: { loading: GlobalLoadingState }) => loading,
  )

  return (
    <Layout>
      <div className="w-full min-h-screen flex flex-col">
        <div className="flex-none w-full z-10">
          <Navigation />
          <NavigationMobile />
        </div>

        <div className="flex-grow w-full min-h-0 flex flex-col">
          {requested && !globalLoading.models.auth && children}
        </div>

        <div className="flex-none w-full">
          <Footer />
        </div>
      </div>
    </Layout>
  )
}

export default BasicLayout
