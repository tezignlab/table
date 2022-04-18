import React, { useState, useEffect } from 'react'
import {
  useDispatch,
  useIntl,
  useParams,
  useSelector,
  history,
  Helmet,
} from 'umi'
import ProjectList from '@/components/ProjectList'
import CollectionModal from '@/components/CollectionModal'
import { CollectionModelState } from '@/models/collection'
import { CollectionModalModeType } from '@/components/CollectionModal'
import { CurrentUserModelState } from '@/models/currentUser'
import { AuthModelState } from '@/models/auth'
import { ProjectModelState } from '@/models/project'
import { SHOT_LIST_PAGE_SIZE } from '@/constants'
import { Left } from '@/components/Icons'

const CollectionsContentPage: React.FC = () => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const params = useParams<{ id: string; username: string }>()
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
  const { count } = useSelector(({ project }: { project: ProjectModelState }) => project)

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
      <Helmet>
        <title>{`${current?.name} - ${intl.formatMessage({
          id: 'collection.page.title',
        })}`}</title>
      </Helmet>
      <div className="w-full lg:px-16 px-4">
        <div
          className="text-gray-600 py-8 flex flex-row gap-1 items-center cursor-pointer"
          onClick={() => {
            history.push(`/user/${params.username}/collections`)
          }}
        >
          <span className='h-4 w-4'><Left /></span>
          <span>{intl.formatMessage({ id: 'general.return' })}</span>
        </div>

        <div className='flex flex-row items-end justify-between'>
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
                  {intl.formatMessage({ id: 'collection.edit' })}
                </button>
                <button
                  className="btn btn-gray"
                  onClick={() => {
                    setModalMode('delete')
                  }}
                >
                  {intl.formatMessage({ id: 'collection.delete' })}
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

      <CollectionModal
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

export default CollectionsContentPage
