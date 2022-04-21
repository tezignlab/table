import React, { ReactElement, useEffect } from 'react'
import clsx from 'clsx'
import { Collection, CollectionModelState } from '../../../../models/collection'
import { useHover } from '../../../../hooks/useHover'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { CurrentUserModelState } from '../../../../models/currentUser'
import { Loading } from '../../../../components/Icons'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import UserLayout from '../../../../components/layouts/user'
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? '')),
    },
  }
}
const CollectionCard: React.FC<{ collection: Collection }> = ({
  collection,
}) => {
  const [isHovering, hoverRef] = useHover<HTMLDivElement>()
  const router = useRouter()
  const { username } = router.query as { username: string }
  const dispatch = useDispatch()

  return (
    <div
      ref={hoverRef}
      className={clsx(
        'cursor-pointer',
        'transition-all duration-200 ease-in-out',
      )}
      key={collection.id}
      onClick={() => {
        dispatch({ type: 'project/clear' })
        dispatch({
          type: 'collection/save',
          payload: { current: undefined },
        })
        router.push(`/user/${username}/collections/${collection.id}`)
      }}
    >
      <div className="w-full flex flex-col relative">
        <div className="w-full h-64 mb-1">
          {collection.covers &&
            (collection.covers.length >= 1 ? (
              <img
                className="object-cover object-center w-full h-full rounded-t-lg"
                src={collection.covers[0]}
              />
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
                  className={clsx(
                    'w-full h-full bg-gray-200',
                    index === 1 ? 'rounded-bl-lg' : 'rounded-br-lg',
                  )}
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
  const dispatch = useDispatch()
  const { t } = useTranslation('common')
  const { user } = useSelector(
    ({ currentUser }: { currentUser: CurrentUserModelState }) => currentUser,
  )
  const { collections, loading } = useSelector(
    ({ collection }: { collection: CollectionModelState }) => collection,
  )

  useEffect(() => {
    dispatch({
      type: 'collection/getCollections',
      payload: { userId: user?.id },
    })
  }, [])

  return (
    <div className="flex-grow w-full min-h-0 flex flex-col space-y-2 bg-white">
      {loading && (
        <div className="flex-grow h-full flex flex-col justify-center w-6 mx-auto">
          <Loading />
        </div>
      )}

      {!loading && (
        <div
          className={clsx(
            'px-4 lg:px-16 grid grid-cols-1 gap-16',
            'md:grid-cols-2',
            'lg:grid-cols-3',
            'xl:grid-cols-4',
          )}
        >
          <Head>
            <title>{`${user?.username}${t('collection.page.title')}`}</title>
          </Head>
          {collections?.map((collection) => (
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
