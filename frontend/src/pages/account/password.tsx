import React from 'react'
import { useDispatch, useSelector, useIntl } from 'umi'
import { useFormik, FormikProvider, Form } from 'formik'
import * as Yup from 'yup'
import { AuthModelState } from '@/models/auth'
import { GlobalLoadingState } from '@/utils'
import Input from '@/components/AuthInput'
import { Loading } from '@/components/Icons'
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from '@/constants'

const Password: React.FC = () => {
  const auth = useSelector(({ auth }: { auth: AuthModelState }) => auth)
  const intl = useIntl()
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
      newPassword: Yup.string()
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
      newPasswordConfirm: Yup.string()
        .required(
          intl.formatMessage(
            { id: 'auth.validation.require' },
            { type: intl.formatMessage({ id: 'user.confirmPassword' }) },
          ),
        )
        .when('newPassword', {
          is: (val: string): boolean => (val && val.length > 0 ? true : false),
          then: Yup.string().oneOf(
            [Yup.ref('newPassword')],
            intl.formatMessage(
              { id: 'auth.validation.correct' },
              { type: intl.formatMessage({ id: 'user.confirmPassword' }) },
            ),
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
                label={intl.formatMessage({ id: 'account.password.old' })}
              />
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                label={intl.formatMessage({ id: 'account.password.new' })}
              />
              <Input
                id="newPasswordConfirm"
                name="newPasswordConfirm"
                type="password"
                label={intl.formatMessage({ id: 'account.password.confirm' })}
              />

              <button className="btn btn-primary space-x-2 flex" type="submit">
                {authLoading && (
                  <div className="h-5 w-5">
                    <Loading color="white" />
                  </div>
                )}
                <span>{intl.formatMessage({ id: 'account.save' })}</span>
              </button>
            </Form>
          </FormikProvider>
        </div>
      )}
    </div>
  )
}

export default Password
