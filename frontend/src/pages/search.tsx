import { getSearchProjects } from '@/services/project'
import clsx from 'clsx'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Close, Search } from '../components/Icons'
import ProjectList from '../components/ProjectList'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? '')),
    },
  }
}

const SearchPage: React.FC = () => {
  const router = useRouter()
  const { query } = router.query as { query: string }

  const { t } = useTranslation('common')
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchValue, setSearchValue] = useState(query)

  useEffect(() => {
    setSearchValue(query)
  }, [router.pathname])

  const handleSearch = () => {
    router.push(`/search?query=${encodeURIComponent(searchValue ?? '')}`)
  }

  const searchFunction = useCallback(
    async ({ skip, limit }: { skip: number; limit: number }) => {
      const result = await getSearchProjects(searchValue, skip, limit)
      return result
    },
    [searchValue],
  )

  return (
    <div className='flex-grow w-full flex flex-col'>
      <Head>
        {query && <title>{`${query} - ${t('site.name')}`}</title>}
        {!query && <title>{`${t('general.search')} - ${t('site.name')}`}</title>}
      </Head>

      <div className='w-full py-8'>
        <div className='w-full flex flex-row justify-center'>
          <div className='w-full mx-4 lg:w-1/2 lg:mx-auto relative'>
            <input
              ref={inputRef}
              className={clsx(
                'mx-auto w-full py-2 pl-6 pr-32 lg:pr-36',
                'text-gray-700 placeholder-gray-500 text-lg',
                'border-2 bg-white outline-none',
                'rounded-lg transition-all duration-200 ease-in-out',
                'focus:border-gray-500 focus:placeholder-transparent',
                'hover:border-gray-400',
              )}
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearch()
                }
              }}
              placeholder={t(`search.projects`)}
            />

            <div
              className={clsx(
                'absolute right-0 top-0 h-full flex flex-row w-auto',
                'transition-all duration-200 ease-in-out',
              )}
            >
              <div
                className={clsx('w-8 mx-4 h-full', 'text-gray-300 hover:text-gray-500 cursor-pointer')}
                onClick={() => {
                  setSearchValue('')
                  inputRef.current?.focus()
                }}
              >
                <Close />
              </div>

              <div
                className={clsx(
                  'w-20 lg:w-24 h-full btn-primary flex flex-col justify-center',
                  'py-3 px-6 lg:px-8 rounded-r-md',
                  'cursor-pointer font-medium transition-colors duration-200 focus:outline-none',
                )}
                onClick={() => {
                  handleSearch()
                }}
              >
                <Search />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProjectList name={`searchProjects-${query}`} loadMore={searchFunction} />
    </div>
  )
}

export default SearchPage
