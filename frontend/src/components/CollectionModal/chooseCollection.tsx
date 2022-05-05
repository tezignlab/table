import { useProject } from '@/hooks/useProject'
import { Collection } from '@/types/collection'
import { Project } from '@/types/project'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import React, { useEffect } from 'react'
import { Check, Loading, Plus } from '../Icons'

const CollectionChoice: React.FC<{
  project: Project
  collection: Collection
}> = ({ project, collection }) => {
  const { toggleProjectCollection, collectLoading } = useProject(project)
  const collected = !!project.collections.find((item) => item.id === collection.id)

  return (
    <div
      className={clsx(
        'py-2 px-4 border border-gray-300 rounded-lg cursor-pointer',
        'flex flex-row justify-between',
        'transition-all duration-200 ease-in-out',
        'hover:bg-gray-200',
        {
          'bg-blue-500 text-white hover:bg-blue-700': collected,
        },
      )}
      onClick={() => {
        toggleProjectCollection(collection)
      }}
    >
      <span className="font-bold">{collection.name}</span>
      {collected && !collectLoading && (
        <div className="h-5 w-5">
          <Check />
        </div>
      )}
      {collectLoading && (
        <div className="h-5 w-5">
          <Loading />
        </div>
      )}
    </div>
  )
}

const ChooseCollection: React.FC<{
  project: Project
  collections: Collection[]
  closeModal: () => void
  showCreateModal: () => void
  refresh: () => void
}> = ({ project, collections, closeModal, showCreateModal , refresh}) => {
  const { t } = useTranslation('common')

  useEffect(() => {
    if ((collections && collections.length === 0) || !collections) {
      showCreateModal()
    }
  }, [])

  return (
    <div className="w-full h-full">
      <div className="text-bold text-xl text-black">{t('collection.collect.desc')}</div>

      <div className="py-4 w-full">
        <div className="flex flex-col space-y-4 max-h-60 overflow-y-scroll">
          {collections?.map((item) => (
            <CollectionChoice project={project} collection={item} key={item.id} />
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
          {t('general.done')}
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
          <span className="h-full flex flex-col justify-center">{t('collection.create')}</span>
        </button>
      </div>
    </div>
  )
}

export default ChooseCollection
