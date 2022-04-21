import React, { ReactElement } from 'react'
import { useFormik, FormikProvider, Form } from 'formik'
import * as Yup from 'yup'
import { AuthModelState } from '../../models/auth'
import { GlobalLoadingState } from '../../utils'
import Input from '../../components/AuthInput'
import { Loading } from '../../components/Icons'
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from '../../constants'
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
export default function Password() {
  const auth = useSelector(({ auth }: { auth: AuthModelState }) => auth)
  const { t } = useTranslation('common')
  const dispatch = useDispatch()
  const globalLoading = useSelector(
    ({ loading }: { loading: GlobalLoadingState }) => loading,
  )

  const authLoading = globalLoading.models.auth

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
    onSubmit: (values: { oldPassword: string; newPassword: string }) => {
      dispatch({
        type: 'auth/updatePassword',
        payload: {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
      })
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required(t('auth.validation.require'))
        .min(
          PASSWORD_MIN_LENGTH,
          `${t('auth.validation.min.prefix')}${PASSWORD_MIN_LENGTH}${t(
            'auth.validation.min.suffix',
          )}`,
        )
        .max(
          PASSWORD_MAX_LENGTH,
          `${t('auth.validation.max.prefix')}${PASSWORD_MAX_LENGTH}${t(
            'auth.validation.max.suffix',
          )}`,
        ),
      newPassword: Yup.string()
        .required(t('auth.validation.require'))
        .min(
          PASSWORD_MIN_LENGTH,
          `${t('auth.validation.min.prefix')}${PASSWORD_MIN_LENGTH}${t(
            'auth.validation.min.suffix',
          )}`,
        )
        .max(
          PASSWORD_MAX_LENGTH,
          `${t('auth.validation.max.prefix')}${PASSWORD_MAX_LENGTH}${t(
            'auth.validation.max.suffix',
          )}`,
        ),
      newPasswordConfirm: Yup.string()
        .required(t('auth.validation.require'))
        .when('newPassword', {
          is: (val: string): boolean => (val && val.length > 0 ? true : false),
          then: Yup.string().oneOf(
            [Yup.ref('newPassword')],
            t('auth.validation.correct'),
          ),
        }),
    }),
  })

  return (
    <div className="w-full h-full">
      {auth.requested && (
        <div className="w-full h-full">
          <FormikProvider value={formik}>
            <Form className="py-4 space-y-4">
              <Input
                id="oldPassword"
                name="oldPassword"
                type="password"
                label={t('account.password.old')}
              />
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                label={t('account.password.new')}
              />
              <Input
                id="newPasswordConfirm"
                name="newPasswordConfirm"
                type="password"
                label={t('account.password.confirm')}
              />

              <button className="btn btn-primary space-x-2 flex" type="submit">
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
      )}
    </div>
  )
}
Password.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>
}
