import { Form, FormikProvider, useFormik } from 'formik'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { ReactElement, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import * as Yup from 'yup'
import Input from '../../components/AuthInput'
import { Loading } from '../../components/Icons'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../../constants'
import AccountLayout from '../../layouts/account'
import { useUpdatePassword } from '../../queries/auth'
import { authStatusState } from '../../stores/auth'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? '')),
    },
  }
}

export default function Password() {
  const { t } = useTranslation('common')

  const authStatus = useRecoilValue(authStatusState)

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
    onSubmit: async (values: { oldPassword: string; newPassword: string }) => {
      setValues({
        password: values.oldPassword,
        newPassword: values.newPassword,
      })
      setSubmit(true)
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required(`${t('auth.validation.require')}${t('account.password.old')}`)
        .min(
          PASSWORD_MIN_LENGTH,
          `${t('auth.validation.min.prefix')}${PASSWORD_MIN_LENGTH}${t('auth.validation.min.suffix')}`,
        )
        .max(
          PASSWORD_MAX_LENGTH,
          `${t('auth.validation.max.prefix')}${PASSWORD_MAX_LENGTH}${t('auth.validation.max.suffix')}`,
        ),
      newPassword: Yup.string()
        .required(`${t('auth.validation.require')}${t('account.password.new')}`)
        .min(
          PASSWORD_MIN_LENGTH,
          `${t('auth.validation.min.prefix')}${PASSWORD_MIN_LENGTH}${t('auth.validation.min.suffix')}`,
        )
        .max(
          PASSWORD_MAX_LENGTH,
          `${t('auth.validation.max.prefix')}${PASSWORD_MAX_LENGTH}${t('auth.validation.max.suffix')}`,
        ),
      newPasswordConfirm: Yup.string()
        .required(t('account.password.confirm'))
        .when('newPassword', {
          is: (val: string): boolean => (val && val.length > 0 ? true : false),
          then: Yup.string().oneOf(
            [Yup.ref('newPassword')],
            `${t('auth.validation.correct')}${t('user.confirmPassword')}`,
          ),
        }),
    }),
  })

  const [values, setValues] = useState<{
    password: string
    newPassword: string
  }>({ password: '', newPassword: '' })
  const [submit, setSubmit] = useState<boolean>(false)

  const { isLoading, refetch: updatePassword } = useUpdatePassword(values)

  useEffect(() => {
    if (submit) {
      updatePassword()
      setSubmit(false)
    }
  }, [values, submit])

  return (
    <div className="w-full h-full">
      {authStatus.requested && (
        <div className="w-full h-full">
          <FormikProvider value={formik}>
            <Form className="py-4 space-y-4">
              <Input id="oldPassword" name="oldPassword" type="password" label={t('account.password.old')} />
              <Input id="newPassword" name="newPassword" type="password" label={t('account.password.new')} />
              <Input
                id="newPasswordConfirm"
                name="newPasswordConfirm"
                type="password"
                label={t('account.password.confirm')}
              />

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
      )}
    </div>
  )
}

Password.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>
}
