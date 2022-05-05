import { useRouter } from 'next/router'
import React from 'react'

export interface BreadcrumbItem {
  name: string
  url: string | undefined
}

const Breadcrumb: React.FC<{ message: BreadcrumbItem[] }> = ({ message }) => {
  const router = useRouter()
  return (
    <div className="w-full flex flex-row space-x-2 py-4 ">
      {message.map((item, index) => (
        <div className="flex flex-row space-x-2 text-gray-500 text-md " key={item.name}>
          <div
            className="cursor-pointer hover:text-gray-700 transition-all duration-200 ease-in-out"
            onClick={() => {
              if (item.url !== undefined) {
                router.push(item.url)
              }
            }}
          >
            {item.name}
          </div>
          {index < message.length - 1 && <div className="">/</div>}
        </div>
      ))}
    </div>
  )
}

export default Breadcrumb
