import React, { useEffect } from 'react'
import { useIntl, useSelector, useDispatch } from 'umi'
import {
  ProjectCollectionModelState,
  ProjectCollection,
} from '@/models/projectCollection'
import { Loading, Check, Plus } from '@/components/Icons'
import clsx from 'clsx'

const CollectionChoice: React.FC<{
  collection: ProjectCollection
  index: number
}> = ({ collection, index }) => {
  const dispatch = useDispatch()
  const { projectId } = useSelector(
    ({ projectCollection }: { projectCollection: ProjectCollectionModelState }) =>
      projectCollection,
  )

  return (
    <div
      className={clsx(
        'py-2 px-4 border border-gray-300 rounded-lg cursor-pointer',
        'flex flex-row justify-between',
        'transition-all duration-200 ease-in-out',
        'hover:bg-gray-200',
        {
          'bg-blue-500 text-white hover:bg-blue-700': collection.is_collect,
        },
      )}
      onClick={() => {
        dispatch({
          type: 'projectCollection/collectProject',
          payload: {
            projectId: projectId,
            collectionId: collection.id,
            method: collection.is_collect ? 'delete' : 'post',
            collectionIndex: index,
          },
        })
      }}
    >
      <span className="font-bold">{collection.name}</span>
      {collection.is_collect && !collection.loading && (
        <div className="h-5 w-5">
          <Check />
        </div>
      )}
      {collection.loading && (
        <div className="h-5 w-5">
          <Loading />
        </div>
      )}
    </div>
  )
}

const ChooseCollection: React.FC<{
  closeModal: () => void
  showCreateModal: () => void
}> = ({ closeModal, showCreateModal }) => {
  const intl = useIntl()
  const { collections, loading } = useSelector(
    ({ projectCollection }: { projectCollection: ProjectCollectionModelState }) =>
      projectCollection,
  )

  useEffect(() => {
    if (!loading && collections && collections.length === 0) {
      showCreateModal()
    }
  }, [loading])

  return (
    <div className="w-full h-full">
      <div className="text-bold text-xl text-black">
        {intl.formatMessage({ id: 'collection.collect.desc' })}
      </div>

      <div className="py-4 w-full">
        {loading && (
          <div className="w-full h-6 flex flex-col justify-center">
            <Loading />
          </div>
        )}
        <div className="flex flex-col space-y-4 max-h-60 overflow-y-scroll">
          {!loading &&
            collections?.map((item, index: number) => (
              <CollectionChoice collection={item} index={index} key={index} />
            ))}
        </div>
      </div>

      <div className="w-full flex flex-row justify-between">
        <button
          className="btn btn-gray"
          onClick={() => {
            closeModal()
          }}
        >
          {intl.formatMessage({ id: 'general.done' })}
        </button>

        <button
          className="btn btn-primary flex flex-row"
          onClick={() => {
            showCreateModal()
          }}
        >
          <div className="h-5 w-5">
            <Plus />
          </div>
          <span className="h-full flex flex-col justify-center">
            {intl.formatMessage({ id: 'collection.create' })}
          </span>
        </button>
      </div>
    </div>
  )
}

export default ChooseCollection
