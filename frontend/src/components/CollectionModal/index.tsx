import { getCollectionsList } from '@/services/project'
import { authUserState } from '@/stores/auth'
import { Project } from '@/types/project'
import React from 'react'
import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import { Loading } from '../Icons'
import Modal from '../Modal'
import ChooseCollection from './chooseCollection'
import CreateCollection from './createCollection'

export type CollectionModalModeType = 'create' | 'choose'

const CollectionsModal: React.FC<{
  project: Project
  mode: CollectionModalModeType | undefined
  visible: boolean
  closeModal: () => void
  changeModalMode: (mode: CollectionModalModeType) => void
}> = ({ project, mode, visible, closeModal, changeModalMode }) => {
  const authUser = useRecoilValue(authUserState)

  const { data, isLoading, refetch } = useQuery(
    ['collections', authUser?.id],
    async () => {
      const result = await getCollectionsList(authUser?.id ?? '')
      return result.data
    },
    { cacheTime: 0 },
  )

  return (
    <Modal visible={visible} toggle={closeModal}>
      {isLoading && (
        <div className="w-full h-6 flex flex-col justify-center">
          <Loading />
        </div>
      )}

      {!isLoading && (
        <>
          {mode === 'create' && (
            <CreateCollection
              collections={data ?? []}
              showChooseModal={() => {
                changeModalMode('choose')
              }}
              refresh={refetch}
            />
          )}

          {mode === 'choose' && (
            <ChooseCollection
              project={project}
              collections={data ?? []}
              closeModal={closeModal}
              showCreateModal={() => {
                changeModalMode('create')
              }}
              refresh={refetch}
            />
          )}
        </>
      )}
    </Modal>
  )
}

export default CollectionsModal
