import NavigationMobile from '@/components/NavigationMobile'
import React from 'react'
import Footer from '../components/Footer'
import Navigation from '../components/Navigation'

export const BasicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex-none w-full z-10">
        <Navigation />
        <NavigationMobile />
      </div>

      <div className="flex-grow w-full min-h-0 flex flex-col">{children}</div>

      <div className="flex-none w-full">
        <Footer />
      </div>
    </div>
  )
}
