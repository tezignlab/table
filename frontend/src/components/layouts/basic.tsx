import React from 'react'
import Navigation from '../Navigation'
import NavigationMobile from '../NavigationMobile'
import Footer from '../Footer'
import Layout from './index'

const BasicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout>
      <div className="w-full min-h-screen flex flex-col">
        <div className="flex-none w-full z-10">
          <Navigation />
          {/* <NavigationMobile /> */}
        </div>

        <div className="flex-grow w-full min-h-0 flex flex-col">{children}</div>

        <div className="flex-none w-full">
          <Footer />
        </div>
      </div>
    </Layout>
  )
}

export default BasicLayout
