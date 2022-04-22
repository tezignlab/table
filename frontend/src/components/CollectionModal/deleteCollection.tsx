import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { CollectionModelState } from '../../models/collection'
import { Loading } from '../Icons'

const DeleteCollection: React.FC<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const dispatch = useDispatch()
  const { username } = router.query as { username: string }

  const { current, loading } = useSelector(
    ({ collection }: { collection: CollectionModelState }) => collection,
  )

  const [confirmed, setConfirmed] = useState<boolean>(false)

  useEffect(() => {
    if (!loading && confirmed) {
      closeModal()
      router.push(`/user/${username}/collections`)
    }
  }, [loading])

  return (
    <div className="w-full h-full flex flex-col space-y-8">
      <div className="text-bold text-xl text-black">
        {t('collection.delete')}
      </div>

      <div className="w-full">
        {t('collection.delete.confirm.prefix')}
        {current?.name}
        {t('collection.delete.confirm.suffix')}
      </div>

      <div className="w-full flex flex-col space-y-2">
        <button
          className="btn btn-primary flex flex-row space-x-2 justify-center"
          onClick={() => {
            dispatch({
              type: 'collection/deleteCollection',
              payload: {
                id: current?.id,
              },
            })
            setConfirmed(true)
          }}
        >
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
  )
}

export default DeleteCollection
