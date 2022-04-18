import React from 'react'
import { useIntl, useDispatch, useSelector } from 'umi'
import { useFormik, FormikProvider, Form } from 'formik'
import * as Yup from 'yup'
import Input from '@/components/AuthInput'
import { Loading } from '@/components/Icons'
import { GlobalLoadingState } from '@/utils'
import { USERNAME_REGEX } from '@/constants'

const SignIn: React.FC = () => {
  const dispatch = useDispatch()
  const globalLoading = useSelector(
    ({ loading }: { loading: GlobalLoadingState }) => loading,
  )

  const intl = useIntl()
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values: { username: string; password: string }) => {
      dispatch({
        type: 'auth/signIn',
        payload: {
          username: values.username,
          password: values.password,
          type: 'username',
        },
      })
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required(
          intl.formatMessage(
            { id: 'auth.validation.require' },
            { type: intl.formatMessage({ id: 'user.username' }) },
          ),
        )
        .matches(
          USERNAME_REGEX,
          intl.formatMessage(
            { id: 'auth.validation.correct' },
            { type: intl.formatMessage({ id: 'user.username' }) },
          ),
        ),
      password: Yup.string().required(
        intl.formatMessage(
          { id: 'auth.validation.require' },
          { type: intl.formatMessage({ id: 'user.password' }) },
        ),
      ),
    }),
  })

  return (
    <div className="flex flex-col w-full mx-auto">
      <div className="w-full text-center text-2xl mb-6 capitalize hidden lg:block">
        {intl.formatMessage({ id: 'auth.welcome' })}
      </div>
      <FormikProvider value={formik}>
        <Form className="flex flex-col space-y-6">
          <Input
            label={intl.formatMessage({ id: 'user.username' })}
            id="username"
            name="username"
            type="text"
          />
          <Input
            label={intl.formatMessage({ id: 'user.password' })}
            id="password"
            name="password"
            type="password"
          />
          <button
            type="submit"
            className="btn btn-primary capitalize flex flex-row space-x-2 justify-center"
            disabled={globalLoading.models.auth}
          >
            {globalLoading.models.auth && (
              <div className="h-5 w-5">
                <Loading color="white" />
              </div>
            )}
            <div className="text-md">
              {intl.formatMessage({ id: 'auth.sign_in' })}
            </div>
          </button>
        </Form>
      </FormikProvider>
    </div>
  )
}

export default SignIn
