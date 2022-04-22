import { useTranslation } from 'next-i18next'
import React, { useState, useEffect, ReactElement } from 'react'
import { useRouter } from 'next/router'
import CollectionsModal, {
  CollectionModalModeType,
} from '../../../../components/CollectionModal'
import { CollectionModelState } from '../../../../models/collection'
import { CurrentUserModelState } from '../../../../models/currentUser'
import { AuthModelState } from '../../../../models/auth'
import { ProjectModelState } from '../../../../models/project'
import Head from 'next/head'
import { Left } from '../../../../components/Icons'
import ProjectList from '../../../../components/ProjectList'
import { SHOT_LIST_PAGE_SIZE } from '../../../../constants'
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
export default function CollectionsContentPage() {
  const { t } = useTranslation('common')
  const dispatch = useDispatch()
  const router = useRouter()
  const params = router.query as { id: string; username: string }

  const [modalMode, setModalMode] = useState<
    CollectionModalModeType | undefined
  >(undefined)

  const { current, loading } = useSelector(
    ({ collection }: { collection: CollectionModelState }) => collection,
  )
  const { user } = useSelector(
    ({ currentUser }: { currentUser: CurrentUserModelState }) => currentUser,
  )
  const { user: authUser } = useSelector(
    ({ auth }: { auth: AuthModelState }) => auth,
  )
  const { count } = useSelector(
    ({ project }: { project: ProjectModelState }) => project,
  )

  useEffect(() => {
    dispatch({
      type: 'collection/getCollectionDetail',
      payload: { id: params.id },
    })
  }, [])

  useEffect(() => {
    dispatch({ type: 'project/clear' })
  }, [])

  return (
    <div className="flex-grow w-full min-h-0 bg-white">
      <Head>
        <title>{`${current?.name} - ${t('collection.page.title')}`}</title>
      </Head>
      <div className="w-full lg:px-16 px-4">
        <div
          className="text-gray-600 py-8 flex flex-row gap-1 items-center cursor-pointer"
          onClick={() => {
            router.push(`/user/${params.username}/collections`)
          }}
        >
          <span className="h-4 w-4">
            <Left />
          </span>
          <span>{t('general.return')}</span>
        </div>

        <div className="flex flex-row items-end justify-between">
          <div>
            {current && !loading && (
              <div className="font-bold text-4xl">{current?.name}</div>
            )}
          </div>
          <div className="flex flex-row space-x-4">
            {user?.id === authUser?.id && (
              <>
                <button
                  className="btn btn-gray"
                  onClick={() => {
                    setModalMode('edit')
                  }}
                >
                  {t('collection.edit')}
                </button>
                <button
                  className="btn btn-gray"
                  onClick={() => {
                    setModalMode('delete')
                  }}
                >
                  {t('collection.delete')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-full py-8">
        <ProjectList
          loadMore={() => {
            dispatch({
              type: 'project/getProjects',
              payload: {
                skip: count,
                limit: SHOT_LIST_PAGE_SIZE,
                collectionId: params.id,
                type: 'collections',
              },
            })
          }}
        />
      </div>

      <CollectionsModal
        mode={modalMode}
        visible={modalMode !== undefined}
        closeModal={() => {
          setModalMode(undefined)
        }}
        changeModalMode={(mode: CollectionModalModeType) => {
          setModalMode(mode)
        }}
      />
    </div>
  )
}

CollectionsContentPage.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>
}
