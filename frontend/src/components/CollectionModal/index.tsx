import React from 'react'
import Modal from '@/components/Modal'
import ChooseCollection from './chooseCollection'
import CreateCollection from './createCollection'
import EditCollection from './editCollection'
import DeleteCollection from './deleteCollection'

export type CollectionModalModeType = 'create' | 'choose' | 'edit' | 'delete'

const CollectionsModal: React.FC<{
  mode: CollectionModalModeType | undefined
  visible: boolean
  closeModal: () => void
  changeModalMode: (mode: CollectionModalModeType) => void
}> = ({ mode, visible, closeModal, changeModalMode }) => {
  return (
    <Modal visible={visible} toggle={closeModal}>
      {mode === 'create' && (
        <CreateCollection
          showChooseModal={() => {
            changeModalMode('choose')
          }}
        />
      )}

      {mode === 'choose' && (
        <ChooseCollection
          closeModal={closeModal}
          showCreateModal={() => {
            changeModalMode('create')
          }}
        />
      )}

      {mode === 'edit' && <EditCollection closeModal={closeModal} />}

      {mode === 'delete' && <DeleteCollection closeModal={closeModal} />}
    </Modal>
  )
}

export default CollectionsModal
