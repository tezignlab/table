import React from 'react'
import clsx from 'clsx'

const ProjectDetailSidebar: React.FC<{
  inModal: boolean
  bottomVisible?: boolean
  topVisible?: boolean
  children: React.ReactNode
}> = ({ inModal, bottomVisible, topVisible, children }) => (
  <div
    className={clsx(
      { 'absolute top-8': inModal },
      { 'fixed top-0': !inModal && !bottomVisible && !topVisible },
      { 'absolute top-0': !inModal && topVisible },
      { 'absolute bottom-0': !inModal && bottomVisible },
      'border-l-2',
      'hidden lg:block h-screen right-0 p-2 lg:p-8 space-y-8 lg:w-1/3 overflow-y-scroll',
    )}
  >
    {children}
  </div>
)

export default ProjectDetailSidebar
