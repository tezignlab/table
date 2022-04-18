import React, { useEffect } from 'react'
import {
  useDispatch,
  useSelector,
  history,
  useParams,
  Helmet,
  useIntl,
} from 'umi'
import { Loading } from '@/components/Icons'
import { CollectionModelState, Collection } from '@/models/collection'
import { CurrentUserModelState } from '@/models/currentUser'
import clsx from 'clsx'
import { useHover } from '@umijs/hooks'

const CollectionCard: React.FC<{ collection: Collection }> = ({
  collection,
}) => {
  const [isHovering, hoverRef] = useHover<HTMLDivElement>()
  const { username } = useParams<{ username: string }>()
  const dispatch = useDispatch()

  return (
    <div
      ref={hoverRef}
      className={clsx(
        'cursor-pointer',
        'transition-all duration-200 ease-in-out',
      )}
      key={collection.id}
      onClick={() => {
        dispatch({ type: 'project/clear' })
        dispatch({
          type: 'collection/save',
          payload: { current: undefined },
        })
        history.push(`/user/${username}/collections/${collection.id}`)
      }}
    >
      <div className="w-full flex flex-col relative">
        <div className="w-full h-64 mb-1">
          {collection.covers &&
            (collection.covers.length >= 1 ? (
              <img
                className="object-cover object-center w-full h-full rounded-t-lg"
                src={collection.covers[0]}
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            ))}
        </div>

        <div className="w-full h-32 grid grid-cols-2 gap-1">
          {[1, 2].map(
            (index) =>
              collection.covers &&
              (collection.covers.length > index ? (
                <img
                  className={clsx("object-cover object-center w-full h-32", index === 1 ? 'rounded-bl-lg' : 'rounded-br-lg')}
                  key={index}
                  src={collection.covers[index]}
                />
              ) : (
                <div key={index} className={clsx("w-full h-full bg-gray-200", index === 1 ? 'rounded-bl-lg' : 'rounded-br-lg')} />
              )),
          )}
        </div>

        <div
          className={clsx(
            'absolute top-0 left-0 h-full w-full',
            'bg-gray-200 opacity-0',
            { 'opacity-30': isHovering },
            'transition-all duration-200 ease-in-out',
          )}
        />
      </div>

      <div className="mt-4 flex flex-row justify-center">
        <div
          className={clsx(
            'font-bold border-b-2 border-black border-opacity-0 pb-1',
            {
              'border-opacity-50': isHovering,
            },
            'transition-all duration-200 ease-in-out',
          )}
        >
          {collection.name}
        </div>
      </div>

      {/* <div className="">{collection.desc}</div> */}
    </div>
  )
}

const CollectionsPage: React.FC = () => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const { user } = useSelector(
    ({ currentUser }: { currentUser: CurrentUserModelState }) => currentUser,
  )
  const { collections, loading } = useSelector(
    ({ collection }: { collection: CollectionModelState }) => collection,
  )

  useEffect(() => {
    dispatch({
      type: 'collection/getCollections',
      payload: { userId: user?.id },
    })
  }, [])

  return (
    <div className="flex-grow w-full min-h-0 flex flex-col space-y-2 bg-white">
      {loading && (
        <div className="flex-grow h-full flex flex-col justify-center w-6 mx-auto">
          <Loading />
        </div>
      )}

      {!loading && (
        <div
          className={clsx(
            'px-4 lg:px-16 grid grid-cols-1 gap-16',
            'md:grid-cols-2',
            'lg:grid-cols-3',
            'xl:grid-cols-4',
          )}
        >
          <Helmet>
            <title>{`${user?.username}${intl.formatMessage({
              id: 'collection.page.title',
            })}`}</title>
          </Helmet>
          {collections?.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CollectionsPage