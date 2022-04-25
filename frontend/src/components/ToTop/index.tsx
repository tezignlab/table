import clsx from 'clsx'
import React from 'react'

const ToTop: React.FC<{
  visible: boolean
  atBottom: boolean
}> = ({ visible, atBottom }) => {
  return (
    <div
      className={clsx('bottom-12 right-10 w-12 h-12', {
        fixed: !atBottom,
        absolute: atBottom,
      })}
    >
      <div
        className={clsx({ hidden: !visible }, 'shadow rounded-full bg-gray-800 p-3 text-gray-100 cursor-pointer')}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </div>
    </div>
  )
}

export default ToTop
