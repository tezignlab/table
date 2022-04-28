import clsx from 'clsx'
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Close } from '../Icons'

const Modal: React.FC<{
  children: React.ReactNode
  visible: boolean
  toggle: () => void
}> = ({ children, visible, toggle }) => {
  // return nothing on server side
  if (typeof window === 'undefined') return <div id="collection modal" />

  let modalContainer: HTMLElement | null = document.getElementById('collection-modal-container')
  if (!modalContainer) {
    modalContainer = document.createElement('div')
    modalContainer.setAttribute('id', 'collection-modal-container')
    document.body.appendChild(modalContainer)
  }

  return (
    <>
      {visible &&
        createPortal(
          <div
            className={clsx(
              'fixed left-0 right-0 top-0 bottom-0',
              'h-screen w-screen z-30',
              'bg-black bg-opacity-50',
              'w-full',
            )}
            onClick={() => {
              toggle()
            }}
          >
            <div className="fixed cursor-pointer top-8 right-8 h-8 w-8 text-gray-300 hover:text-gray-100 transition-all duration-200 ease-in-out">
              <Close />
            </div>

            <div
              className={clsx('w-4/5 rounded-lg bg-white z-50 mx-auto', 'mt-36 p-4', 'lg:max-w-xl lg:p-8')}
              onClick={(e) => {
                // prevent parent onClick event
                e.stopPropagation()
              }}
            >
              {children}
            </div>
          </div>,
          modalContainer,
        )}
    </>
  )
}

export default Modal
