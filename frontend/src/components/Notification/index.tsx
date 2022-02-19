import React, { useState, useImperativeHandle } from 'react'
import ReactDOM from 'react-dom'
import clsx from 'clsx'

const Notice = ({
  type,
  message,
  childRef,
}: {
  type: string
  message: string
  childRef: React.LegacyRef<HTMLDivElement>
}) => {
  return (
    <div
      ref={childRef}
      className="mx-auto flex overflow-hidden bg-white rounded-lg shadow-md animate__animated animate__fadeInDown"
    >
      <div
        className={clsx('flex items-center justify-center w-12', {
          'bg-green-500': type === 'success',
          'bg-blue-500': type === 'info',
          'bg-red-500': type === 'error',
        })}
      >
        <svg
          className="w-6 h-6 text-white fill-current"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
        </svg>
      </div>

      <div className="px-4 py-4 -mx-3">
        <div className="mx-3">
          <div className="text-sm text-gray-600">{message}</div>
        </div>
      </div>
    </div>
  )
}

interface NoticeItem {
  key: string
  value: React.ReactNode
}

interface NoticeProps {} // eslint-disable-line

type NoticeHandler = {
  add: (type: string, message: string, delay: number) => void
}

const NoticeWrapperOriginal: React.ForwardRefRenderFunction<
  NoticeHandler,
  NoticeProps
> = (_, ref) => {
  const [noticeList, setNoticeList] = useState<NoticeItem[]>([])

  const removeNotice = (key: string) => {
    setNoticeList((noticeList) => [
      ...noticeList.filter((item: NoticeItem) => item.key !== key),
    ])
  }
  const getKey = () => `notice-${new Date().getTime()}-${noticeList.length}`

  useImperativeHandle(ref, () => ({
    add: (type: string, message: string, delay: number) => {
      const key = getKey()
      const noticeRef = React.createRef<HTMLDivElement>()

      setNoticeList([
        ...noticeList,
        {
          key: key,
          value: (
            <Notice
              childRef={noticeRef}
              key={key}
              type={type}
              message={message}
            />
          ),
        },
      ])

      if (delay > 0) {
        // 200 is the default animation time
        // configured in tailwind.config.js
        if (delay > 200) {
          setTimeout(() => {
            noticeRef.current?.classList.add('animate__fadeOutUp')
          }, delay)
        }
        setTimeout(() => {
          removeNotice(key)
        }, delay + 200)
      }
    },
  }))

  return (
    <div className="fixed top-4 left-0 right-0 flex flex-col space-y-6 z-50">
      {noticeList.map((item: NoticeItem) => item.value)}
    </div>
  )
}

const NoticeWrapper = React.forwardRef(NoticeWrapperOriginal)

export const notification = (() => {
  let noticeContainer: HTMLElement | null = document.getElementById(
    'notice-container',
  )
  if (!noticeContainer) {
    noticeContainer = document.createElement('div')
    noticeContainer.setAttribute('id', 'notice-container')
    document.body.appendChild(noticeContainer)
  }

  const wrapperRef = React.createRef<React.ElementRef<typeof NoticeWrapper>>()

  ReactDOM.render(<NoticeWrapper ref={wrapperRef} />, noticeContainer)

  return (type: string, message: string, delay: number) => {
    wrapperRef.current?.add(type, message, delay)
  }
})()
