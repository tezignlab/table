import { Form, FormikProvider, useFormik } from 'formik'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import * as Yup from 'yup'
import Input from '../../components/AuthInput'
import { Check, Loading } from '../../components/Icons'
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from '../../constants'
import { useSignUp } from '../../queries/auth'
import { authStatusState } from '../../stores/auth'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? '')),
    },
  }
}
export default function SignUp() {
  const authStatus = useRecoilValue(authStatusState)
  const { t } = useTranslation('common')
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      setValues(values)
      setSubmit(true)
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required(t('auth.validation.require'))
        .min(
          USERNAME_MIN_LENGTH,
          `${t('auth.validation.min.prefix')}${USERNAME_MIN_LENGTH}${t('auth.validation.min.suffix')}`,
        )
        .max(
          USERNAME_MAX_LENGTH,
          `${t('auth.validation.max.prefix')}${USERNAME_MAX_LENGTH}${t('auth.validation.max.suffix')}`,
        )
        .matches(USERNAME_REGEX, t('auth.validation.correct')),
      email: Yup.string()
        .required(t('auth.validation.require'))
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, t('auth.validation.correct')),
      password: Yup.string()
        .required(t('auth.validation.require'))
        .min(
          PASSWORD_MIN_LENGTH,
          `${t('auth.validation.min.prefix')}${PASSWORD_MIN_LENGTH}${t('auth.validation.min.suffix')}`,
        )
        .max(
          PASSWORD_MAX_LENGTH,
          `${t('auth.validation.max.prefix')}${PASSWORD_MAX_LENGTH}${t('auth.validation.max.suffix')}`,
        ),
      confirmPassword: Yup.string()
        .required(t('auth.validation.require'))
        .when('password', {
          is: (val: string): boolean => (val && val.length > 0 ? true : false),
          then: Yup.string().oneOf([Yup.ref('password')], t('auth.validation.correct')),
        }),
    }),
  })
  const [values, setValues] = useState<{
    username: string
    password: string
    email: string
  }>(formik.values)
  const [submit, setSubmit] = useState(false)

  const { isLoading, refetch: signUp } = useSignUp(values)

  useEffect(() => {
    if (submit) {
      signUp()
      setSubmit(false)
    }
  }, [values, submit])

  return (
    <div className="flex flex-col w-full mx-auto">
      {!authStatus.success && (
        <FormikProvider value={formik}>
          <div className="w-full text-center text-2xl mb-2 hidden lg:block">{t('auth.sign_up')}</div>
          <Form className="flex flex-col space-y-6 text-left">
            <Input
              label={t('user.username')}
              id="username"
              name="username"
              type="text"
              desc={t('user.username.desc')}
            />
            <Input label={t('user.email')} id="email" name="email" type="text" />
            <Input
              label={t('user.password')}
              id="password"
              name="password"
              type="password"
              desc={t('user.password.desc')}
            />
            <Input label={t('user.confirmPassword')} id="confirmPassword" name="confirmPassword" type="password" />

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
              <div className="text-md">{t('auth.sign_up')}</div>
            </button>
          </Form>
        </FormikProvider>
      )}

      {!!authStatus.success && (
        <div className="w-full flex flex-col justify-between">
          <div className="w-36 mx-auto text-green-500">
            <Check />
          </div>

          <div className="text-lg text-black text-center">{t('auth.sign_up.success')}</div>
        </div>
      )}
    </div>
  )
}
// SignUp.getLayout = function getLayout(page: ReactElement) {
//   return <AuthLayout>{page}</AuthLayout>
// }
