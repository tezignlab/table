import clsx from 'clsx'
import React from 'react'
import { Close } from '../Icons'

const ProjectDetailModal: React.FC<{
  hidden: boolean
  children: React.ReactNode
  toggle: () => void
}> = ({ hidden, children, toggle }) => (
  <div
    className={clsx('fixed h-screen w-screen top-0', 'bg-gray-400 bg-opacity-50', 'z-40 p-4', { hidden: hidden })}
    onClick={() => {
      toggle()
    }}
  >
    <div
      className={clsx('relative rounded-lg bg-white', 'mt-32 py-8 px-4 flex justify-center', {
        'animate__animated animate__bounceIn': !hidden,
      })}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <div className="absolute top-2 right-2 h-8 w-8 text-gray-300 " onClick={() => toggle()}>
        <Close />
      </div>

      {children}
    </div>
  </div>
)

export default ProjectDetailModal
