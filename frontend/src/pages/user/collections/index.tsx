import { Loading } from '@/components/Icons'
import { useHover } from '@/hooks/useHover'
import UserLayout from '@/layouts/user'
import { getCollectionsList } from '@/services/project'
import { authUserState } from '@/stores/auth'
import { Collection } from '@/types/collection'
import clsx from 'clsx'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? '')),
    },
  }
}
const CollectionCard: React.FC<{ collection: Collection }> = ({ collection }) => {
  const [isHovering, hoverRef] = useHover<HTMLDivElement>()
  const router = useRouter()

  return (
    <div
      ref={hoverRef}
      className={clsx('cursor-pointer', 'transition-all duration-200 ease-in-out')}
      key={collection.id}
      onClick={() => {
        router.push(`/user/collections/${collection.id}`)
      }}
    >
      <div className="w-full flex flex-col relative">
        <div className="w-full h-64 mb-1">
          {collection.covers &&
            (collection.covers.length >= 1 ? (
              <img className="object-cover object-center w-full h-full rounded-t-lg" src={collection.covers[0]} />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            ))}
        </div>

        <div className="w-full h-32 grid grid-cols-2 gap-1">
          {[1, 2].map(
            (index) =>
              collection.covers &&
              (collection.covers.length > index ? (
                <img
                  className={clsx(
                    'object-cover object-center w-full h-32',
                    index === 1 ? 'rounded-bl-lg' : 'rounded-br-lg',
                  )}
                  key={index}
                  src={collection.covers[index]}
                />
              ) : (
                <div
                  key={index}
                  className={clsx('w-full h-full bg-gray-200', index === 1 ? 'rounded-bl-lg' : 'rounded-br-lg')}
                />
              )),
          )}
        </div>

        <div
          className={clsx(
            'absolute top-0 left-0 h-full w-full',
            'bg-gray-200 opacity-0',
            { 'opacity-30': isHovering },
            'transition-all duration-200 ease-in-out',
          )}
        />
      </div>

      <div className="mt-4 flex flex-row justify-center">
        <div
          className={clsx(
            'font-bold border-b-2 border-black border-opacity-0 pb-1',
            {
              'border-opacity-50': isHovering,
            },
            'transition-all duration-200 ease-in-out',
          )}
        >
          {collection.name}
        </div>
      </div>
    </div>
  )
}

export default function CollectionsPage() {
  const { t } = useTranslation('common')
  const authUser = useRecoilValue(authUserState)

  const { data, isLoading } = useQuery(['collections', authUser?.id], async () => {
    const result = await getCollectionsList(authUser?.id ?? '')
    return result.data
  }, {
    cacheTime: 0
  })

  return (
    <div className="flex-grow w-full min-h-0 flex flex-col space-y-2 bg-white">
      {isLoading && (
        <div className="flex-grow h-full flex flex-col justify-center w-6 mx-auto">
          <Loading />
        </div>
      )}

      {!isLoading && (
        <div
          className={clsx(
            'px-4 lg:px-16 grid grid-cols-1 gap-16',
            'md:grid-cols-2',
            'lg:grid-cols-3',
            'xl:grid-cols-4',
          )}
        >
          <Head>
            <title>{`${authUser?.username}${t('collection.page.title')}`}</title>
          </Head>
          {data?.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}
    </div>
  )
}

CollectionsPage.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>
}
