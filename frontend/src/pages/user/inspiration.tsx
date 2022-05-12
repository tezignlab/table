import { getInspiration } from '@/services/inspiration'
import { authUserState } from '@/stores/auth'
import { Inspiration } from '@/types/inspiration'
import moment from 'moment'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import React, { ReactElement, useState } from 'react'
import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import { Loading } from '@/components/Icons'
import UserLayout from '@/layouts/user'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? '')),
    },
  }
}

const InspirationCard: React.FC<{ inspiration: Inspiration }> = ({ inspiration }) => {
  return (
    <div className='w-full h-full mx-8 px-8 py-2 mb-8 border border-gray-200 rounded-lg'>
      <p className='text-gray-400 my-2'>{moment(inspiration.create_time).format('YYYY-MM-DD HH:mm:ss')}</p>
      <div className='text-lg '>
        <p>{inspiration.content}</p>
      </div>
      <div className='flex flex-row flex-wrap'>
        {inspiration.files?.map((file, index) => (
          <img
            src={file.thumbnail}
            alt=''
            key={index}
            className='h-64 w-64 my-4 mx-2 object-cover object-center rounded-lg'
          />
        ))}
      </div>
    </div>
  )
}

export default function InspirationPage() {
  const { t } = useTranslation('common')
  const [limit, setLimit] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const authUser = useRecoilValue(authUserState)

  const { data, isFetching } = useQuery(['inspiration', authUser?.id, limit], async () => {
    const result = await getInspiration(0, limit)
    if (!result.data.has_more) setHasMore(false)
    return result.data.data
  })

  return (
    <div>
      {isFetching && (
        <div className='flex-grow h-full flex flex-col justify-center w-6 mx-auto'>
          <Loading />
        </div>
      )}

      {!isFetching && (
        <div>
          <Head>
            <title>{`${authUser?.username}${t('likes.page.title')}`}</title>
          </Head>
          <div className='flex flex-col w-2/3 mx-auto'>
            {data?.map((inspiration) => (
              <InspirationCard key={inspiration.id} inspiration={inspiration} />
            ))}
          </div>
        </div>
      )}

      <div className='w-full flex justify-center '>
        {!isFetching && hasMore && data && data.length > 0 && (
          <button
            className='btn btn-primary'
            onClick={() => {
              setLimit(limit + 20)
            }}
          >
            {t('general.load_more')}
          </button>
        )}
      </div>
    </div>
  )
}

InspirationPage.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>
}
