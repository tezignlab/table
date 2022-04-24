import React, { ReactElement, useEffect } from 'react'
import { useFormik, FormikProvider, Form } from 'formik'
import { AuthModelState } from '../../models/auth'
import { GlobalLoadingState } from '../../utils'
import * as Yup from 'yup'
import { USERNAME_MAX_LENGTH } from '../../constants'
import { FormikInput as Input } from '../../components/Input'
import { Loading } from '../../components/Icons'
import { useTranslation } from 'next-i18next'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import AccountLayout from '../../components/layouts/account'
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? '')),
    },
  }
}
export default function Profile() {
  const auth = useSelector(({ auth }: { auth: AuthModelState }) => auth)
  const { t } = useTranslation('common')
  const dispatch = useDispatch()
  const globalLoading = useSelector(
    ({ loading }: { loading: GlobalLoadingState }) => loading,
  )

  const authLoading = globalLoading.models.auth

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      nickname: '',
      bio: '',
    },
    onSubmit: (values) => {
      dispatch({
        type: 'auth/updateUser',
        payload: {
          nickname: values.nickname,
          bio: values.bio,
        },
      })
    },
    validationSchema: Yup.object({
      nickname: Yup.string().max(
        USERNAME_MAX_LENGTH,
        `${t('auth.validation.max.prefix')}${USERNAME_MAX_LENGTH}${t(
          'auth.validation.max.suffix',
        )}`,
      ),
    }),
  })

  useEffect(() => {
    if (!authLoading) {
      formik.setFieldValue('username', auth.user?.username)
      formik.setFieldValue('email', auth.user?.email)
      formik.setFieldValue('nickname', auth.user?.nickname)
      formik.setFieldValue('bio', auth.user?.bio ?? '')
    }
  }, [authLoading])

  return (
    <div className="w-full h-full">
      {auth.requested && (
        <div className="flex fle-row gap-8">
          <div className="flex-0 h-16 lg:h-24">
            <img className="h-full rounded-full" src={auth.user?.avatar} />
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

                <Input
                  id="bio"
                  name="bio"
                  type="text"
                  label={t('account.bio')}
                />

                <button
                  className="btn btn-primary space-x-2 flex"
                  type="submit"
                >
                  {authLoading && (
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