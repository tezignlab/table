import { FC } from 'react'
import { useIntl, useSelector, useDispatch } from 'umi'
import { useFormik, FormikProvider, Form } from 'formik'
import * as Yup from 'yup'
import Input from '@/components/AuthInput'
import { Loading, Check } from '@/components/Icons'
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  USERNAME_REGEX,
} from '@/constants'
import { AuthModelState } from '@/models/auth'

const SignUp: FC = () => {
  const dispatch = useDispatch()
  const { loading, success } = useSelector(
    ({ auth }: { auth: AuthModelState }) => auth,
  )

  const intl = useIntl()
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      dispatch({
        type: 'auth/signUp',
        payload: {
          username: values.username,
          password: values.password,
          email: values.email,
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
        .min(
          USERNAME_MIN_LENGTH,
          intl.formatMessage({ id: 'auth.validation.min' }, { count: 4 }),
        )
        .max(
          USERNAME_MAX_LENGTH,
          intl.formatMessage({ id: 'auth.validation.max' }, { count: 16 }),
        )
        .matches(
          USERNAME_REGEX,
          intl.formatMessage(
            { id: 'auth.validation.correct' },
            { type: intl.formatMessage({ id: 'user.username' }) },
          ),
        ),
      email: Yup.string()
        .required(
          intl.formatMessage(
            { id: 'auth.validation.require' },
            { type: intl.formatMessage({ id: 'user.email' }) },
          ),
        )
        .matches(
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
          intl.formatMessage(
            { id: 'auth.validation.correct' },
            { type: intl.formatMessage({ id: 'user.email' }) },
          ),
        ),
      password: Yup.string()
        .required(
          intl.formatMessage(
            { id: 'auth.validation.require' },
            { type: intl.formatMessage({ id: 'user.password' }) },
          ),
        )
        .min(
          PASSWORD_MIN_LENGTH,
          intl.formatMessage({ id: 'auth.validation.min' }, { count: 6 }),
        )
        .max(
          PASSWORD_MAX_LENGTH,
          intl.formatMessage({ id: 'auth.validation.max' }, { count: 16 }),
        ),
      confirmPassword: Yup.string()
        .required(
          intl.formatMessage(
            { id: 'auth.validation.require' },
            { type: intl.formatMessage({ id: 'user.confirmPassword' }) },
          ),
        )
        .when('password', {
          is: (val: string): boolean => (val && val.length > 0 ? true : false),
          then: Yup.string().oneOf(
            [Yup.ref('password')],
            intl.formatMessage(
              { id: 'auth.validation.correct' },
              { type: intl.formatMessage({ id: 'user.confirmPassword' }) },
            ),
          ),
        }),
    }),
  })

  return (
    <div className="flex flex-col w-full mx-auto">
      {!success && (
        <FormikProvider value={formik}>
          <div className="w-full text-center text-2xl mb-2 hidden lg:block">
            {intl.formatMessage({ id: 'auth.sign_up' })}
          </div>
          <Form className="flex flex-col space-y-6 text-left">
            <Input
              label={intl.formatMessage({ id: 'user.username' })}
              id="username"
              name="username"
              type="text"
              desc={intl.formatMessage({ id: 'user.username.desc' })}
            />
            <Input
              label={intl.formatMessage({ id: 'user.email' })}
              id="email"
              name="email"
              type="text"
            />
            <Input
              label={intl.formatMessage({ id: 'user.password' })}
              id="password"
              name="password"
              type="password"
              desc={intl.formatMessage({ id: 'user.password.desc' })}
            />
            <Input
              label={intl.formatMessage({ id: 'user.confirmPassword' })}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
            />

            <button
              type="submit"
              className="btn btn-primary capitalize flex flex-row space-x-2 justify-center"
              disabled={loading}
            >
              {loading && (
                <div className="h-5 w-5">
                  <Loading color="white" />
                </div>
              )}
              <div className="text-md">
                {intl.formatMessage({ id: 'auth.sign_up' })}
              </div>
            </button>
          </Form>
        </FormikProvider>
      )}

      {!!success && (
        <div className="w-full flex flex-col justify-between">
          <div className="w-36 mx-auto text-green-500">
            <Check />
          </div>

          <div className="text-lg text-black text-center">
            {intl.formatMessage({ id: 'auth.sign_up.success' })}
          </div>
          
        </div>
      )}
    </div>
  )
}

export default SignUp
