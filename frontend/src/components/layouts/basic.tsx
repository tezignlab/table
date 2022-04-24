import React, { ReactNode } from 'react'
import Navigation from '../Navigation'
import NavigationMobile from '../NavigationMobile'
import Footer from '../Footer'
import Layout from './index'
import { useRouter } from 'next/router'
import { AuthLayout } from './auth'

const BasicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  let childrenWithLayout: ReactNode
  const router = useRouter()

  if (router.pathname.startsWith('/auth')) {
    childrenWithLayout = <AuthLayout>{children}</AuthLayout>
  } else {
    childrenWithLayout = (
      <div className='w-full min-h-screen flex flex-col'>
        <div className='flex-none w-full z-10'>
          <Navigation />
          {/* <NavigationMobile /> */}
        </div>

        <div className='flex-grow w-full min-h-0 flex flex-col'>{children}</div>

        <div className='flex-none w-full'>
          <Footer />
        </div>
      </div>
    )
  }
  return <Layout>{childrenWithLayout}</Layout>
}

export default BasicLayout
