import { Form, FormikProvider, useFormik } from 'formik'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import Input from '../../components/AuthInput'
import { Loading } from '../../components/Icons'
import { USERNAME_REGEX } from '../../constants'
import { useSignIn } from '../../queries/auth'
// import { AuthLayout } from '../../components/layouts/auth'
// import { useRecoilValue } from 'recoil'
// import { authStatusState } from '@/stores/auth'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? '')),
    },
  }
}

export default function SignIn() {
  // const authStatus = useRecoilValue(authStatusState)

  const { t } = useTranslation('common')
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values: { username: string; password: string }) => {
      setValues(values)
      setSubmit(true)
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required(t('auth.validation.require'))
        .matches(USERNAME_REGEX, t('auth.validation.correct')),
      password: Yup.string().required(t('auth.validation.require')),
    }),
  })
  const [values, setValues] = useState<{ username: string; password: string }>(formik.values)
  const [submit, setSubmit] = useState<boolean>(false)

  const { isLoading, refetch: signIn } = useSignIn(values)

  useEffect(() => {
    if (submit) {
      signIn()
      setSubmit(false)
    }
  }, [values, submit])
  return (
    <div className="flex flex-col w-full mx-auto">
      <div className="w-full text-center text-2xl mb-6 capitalize hidden lg:block">{t('auth.welcome')}</div>
      <FormikProvider value={formik}>
        <Form className="flex flex-col space-y-6">
          <Input label={t('user.username')} id="username" name="username" type="text" />
          <Input label={t('user.password')} id="password" name="password" type="password" />
          <button
            type="submit"
            className="btn btn-primary capitalize flex flex-row space-x-2 justify-center"
            disabled={isLoading}
          >
            {isLoading && (
              <div className="h-5 w-5">
                <Loading color="white" />
              </div>
            )}

            <div className="text-md">{t('auth.sign_in')}</div>
          </button>
        </Form>
      </FormikProvider>
    </div>
  )
}
