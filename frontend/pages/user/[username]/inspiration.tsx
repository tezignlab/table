import React, { useEffect, useState } from 'react'
// import { Helmet, useDispatch, useIntl, useSelector } from 'umi'
import { Inspiration, InspirationModelState } from '../../../models/inspiration'
import { CurrentUserModelState } from '../../../models/currentUser'
import { GlobalLoadingState } from '../../../utils'
import { Loading } from '../../../components/Icons'
import moment from 'moment'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'

const InspirationCard: React.FC<{ inspiration: Inspiration }> = ({
  inspiration,
}) => {
  return (
    <div className="w-full h-full mx-8 px-8 py-2 mb-8 border border-gray-200 rounded-lg">
      <p className="text-gray-400 my-2">
        {moment(inspiration.create_time).format('YYYY-MM-DD HH:mm:ss')}
      </p>
      <div className="text-lg ">
        <p>{inspiration.content}</p>
      </div>
      <div className="flex flex-row flex-wrap">
        {inspiration.files?.map((file, index) => (
          <img
            src={file.thumbnail}
            alt=""
            key={index}
            className="h-64 w-64 my-4 mx-2 object-cover object-center rounded-lg"
          />
        ))}
      </div>
    </div>
  )
}

const InspirationPage: React.FC = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation('common')
  const [skip, setSkip] = useState(0)
  const { user } = useSelector(
    ({ currentUser }: { currentUser: CurrentUserModelState }) => currentUser,
  )
  const { inspiration, hasMoreInspiration } = useSelector(
    ({ inspiration }: { inspiration: InspirationModelState }) => inspiration,
  )
  const loading = useSelector(
    ({ loading }: { loading: GlobalLoadingState }) => loading,
  )
  useEffect(() => {
    dispatch({
      type: 'inspiration/getInspiration',
      payload: { skip, limit: 20 },
    })
  }, [skip])
  useEffect(() => {
    dispatch({ type: 'inspiration/clear' })
  }, [])

  return (
    <div>
      {loading.models.inspiration && (
        <div className="flex-grow h-full flex flex-col justify-center w-6 mx-auto">
          <Loading />
        </div>
      )}
      {!loading.models.inspiration && (
        <div>
          <Head>
            <title>{`${user?.username}${t('likes.page.title')}`}</title>
          </Head>
          <div className="flex flex-col w-2/3 mx-auto">
            {inspiration?.map((inspiration) => (
              <InspirationCard key={inspiration.id} inspiration={inspiration} />
            ))}
          </div>
        </div>
      )}
      <div className="w-full flex justify-center ">
        {!loading && hasMoreInspiration && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setSkip(skip + 20)
            }}
          >
            {t('general.load_more')}
          </button>
        )}
      </div>
    </div>
  )
}

export default InspirationPage
