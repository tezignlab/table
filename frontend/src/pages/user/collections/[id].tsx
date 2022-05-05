import CollectionDeleteModal from '@/components/CollectionDeleteModal'
import CollectionEditModal from '@/components/CollectionEditModal'
import { Left } from '@/components/Icons'
import ProjectList from '@/components/ProjectList'
import UserLayout from '@/layouts/user'
import { getCollectionDetail, getCollectionDetailList } from '@/services/project'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { ReactElement, useState } from 'react'
import { useQuery } from 'react-query'
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? '')),
    },
  }
}
export default function CollectionsContentPage() {
  const { t } = useTranslation('common')

  const router = useRouter()
  const params = router.query as { id: string }
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const {
    data: current,
    isLoading,
    refetch,
  } = useQuery(['collectionDetail', params.id], async () => {
    const result = await getCollectionDetail(params.id)
    return result.data
  })

  const loadMore = async ({ skip, limit }: { skip: number; limit: number }) => {
    const result = await getCollectionDetailList(params.id, skip, limit)
    return result
  }

  return (
    <div className="flex-grow w-full min-h-0 bg-white">
      <Head>
        <title>{`${current?.name} - ${t('collection.page.title')}`}</title>
      </Head>
      <div className="w-full lg:px-16 px-4">
        <div className="py-8 flex">
        <div
          className="text-gray-600 cursor-pointer flex flex-row items-center space-x-1"
          onClick={() => {
            router.push(`/user/collections`)
          }}
        >
          <span className="h-4 w-4">
            <Left />
          </span>
          <span>{t('general.return')}</span>
        </div>
        </div>

        <div className="flex flex-row items-end justify-between">
          <div>{current && !isLoading && <div className="font-bold text-4xl">{current?.name}</div>}</div>
          <div className="flex flex-row space-x-4">
            <button
              className="btn btn-gray"
              onClick={() => {
                setEditModal(true)
              }}
            >
              {t('collection.edit')}
            </button>
            <button
              className="btn btn-gray"
              onClick={() => {
                setDeleteModal(true)
              }}
            >
              {t('collection.delete')}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full py-8">
        <ProjectList name={`collection-list-${params.id}`} loadMore={loadMore} />
      </div>

      {current && (
        <CollectionEditModal
          collection={current}
          visible={editModal}
          closeModal={() => setEditModal(false)}
          refresh={refetch}
        />
      )}

      {current && (
        <CollectionDeleteModal
          collection={current}
          visible={deleteModal}
          closeModal={() => setDeleteModal(false)}
          refresh={refetch}
        />
      )}
    </div>
  )
}

CollectionsContentPage.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>
}
