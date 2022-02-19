import React, { useEffect, useState } from 'react'
import { useIntl, useDispatch, useSelector, history, useParams } from 'umi'
import { CollectionModelState } from '@/models/collection'
import { Loading } from '@/components/Icons'

const DeleteCollection: React.FC<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const { username } = useParams<{ username: string }>()

  const { current, loading } = useSelector(
    ({ collection }: { collection: CollectionModelState }) => collection,
  )

  const [confirmed, setConfirmed] = useState<boolean>(false)

  useEffect(() => {
    if (!loading && confirmed) {
      closeModal()
      history.push(`/user/${username}/collections`)
    }
  }, [loading])

  return (
    <div className="w-full h-full flex flex-col space-y-8">
      <div className="text-bold text-xl text-black">
        {intl.formatMessage({ id: 'collection.delete' })}
      </div>

      <div className="w-full">
        {intl.formatMessage(
          { id: 'collection.delete.confirm' },
          { name: current?.name },
        )}
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
          <span>{intl.formatMessage({ id: 'collection.delete' })}</span>
        </button>

        <button className="btn btn-gray" onClick={closeModal}>
          {intl.formatMessage({ id: 'general.cancel' })}
        </button>
      </div>
    </div>
  )
}

export default DeleteCollection
