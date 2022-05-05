import { deleteCollection } from '@/services/project'
import { Collection } from '@/types/collection'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { Loading } from '../Icons'
import Modal from '../Modal'

const CollectionDeleteModal: React.FC<{
  collection: Collection
  visible: boolean
  closeModal: () => void
  refresh: () => void
}> = ({ collection, visible, closeModal, refresh }) => {
  const { t } = useTranslation('common')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteCollection(collection.id)
      setConfirmed(true)
      refresh()
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (confirmed) closeModal()
  }, [confirmed])

  return (
    <Modal visible={visible} toggle={closeModal}>
      <div className="w-full h-full flex flex-col space-y-8">
        <div className="text-bold text-xl text-black">{t('collection.delete')}</div>

        <div className="w-full">
          {t('collection.delete.confirm.prefix')}
          {collection.name}
          {t('collection.delete.confirm.suffix')}
        </div>

        <div className="w-full flex flex-col space-y-2">
          <button className="btn btn-primary flex flex-row space-x-2 justify-center" onClick={handleDelete}>
            {loading && (
              <div className="h-5 w-5">
                <Loading />
              </div>
            )}
            <span>{t('collection.delete')}</span>
          </button>

          <button className="btn btn-gray" onClick={closeModal}>
            {t('general.cancel')}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default CollectionDeleteModal
