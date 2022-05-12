import AccountLayout from '@/layouts/account'
import { Form, FormikProvider, useFormik } from 'formik'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useEffect, useState } from 'react'
import { ReactElement } from 'react-markdown/lib/react-markdown'
import { useRecoilValue } from 'recoil'
import * as Yup from 'yup'
import { Loading } from '../../components/Icons'
import { FormikInput as Input } from '../../components/Input'
import { USERNAME_MAX_LENGTH } from '../../constants'
import { useUpdateUser } from '../../queries/auth'
import { authStatusState, authUserState } from '../../stores/auth'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? '')),
    },
  }
}

const Profile = () => {
  const { t } = useTranslation('common')

  const authUser = useRecoilValue(authUserState)
  const authStatus = useRecoilValue(authStatusState)

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      nickname: '',
      bio: '',
    },
    onSubmit: async (values) => {
      setValues(values)
      setSubmit(true)
    },
    validationSchema: Yup.object({
      nickname: Yup.string().max(USERNAME_MAX_LENGTH, t('auth.validation.max')),
    }),
  })

  const [values, setValues] = useState(formik.values)
  const [submit, setSubmit] = useState(false)

  const { isLoading, refetch: updateUser } = useUpdateUser(values)

  useEffect(() => {
    if (submit) {
      updateUser()
      setSubmit(false)
    }
  }, [values, submit])

  useEffect(() => {
    if (!isLoading) {
      formik.setFieldValue('username', authUser?.username)
      formik.setFieldValue('email', authUser?.email)
      formik.setFieldValue('nickname', authUser?.nickname)
      formik.setFieldValue('bio', authUser?.bio ?? '')
    }
  }, [isLoading, authUser])

  return (
    <div className="w-full h-full">
      {authStatus.requested && (
        <div className="flex fle-row gap-8">
          <div className="flex-0 h-16 lg:h-24">
            <img className="h-full rounded-full" src={authUser?.avatar} />
          </div>

          <div className="flex flex-1">
            <FormikProvider value={formik}>
              <Form className="w-full space-y-6">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  label={t('account.username')}
                  disabled={true}
                  desc={t('account.username.desc')}
                />

                <Input
                  id="email"
                  name="email"
                  type="text"
                  label={t('account.email')}
                  disabled={true}
                  desc={t('account.email.desc')}
                />

                <Input
                  id="nickname"
                  name="nickname"
                  type="text"
                  label={t('account.nickname')}
                  desc={t('account.nickname.desc')}
                />

                <Input id="bio" name="bio" type="text" label={t('account.bio')} />

                <button className="btn btn-primary space-x-2 flex" type="submit">
                  {isLoading && (
                    <div className="h-5 w-5">
                      <Loading color="white" />
                    </div>
                  )}
                  <span>{t('account.save')}</span>
                </button>
              </Form>
            </FormikProvider>
          </div>
        </div>
      )}
    </div>
  )
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>
}

export default Profile
