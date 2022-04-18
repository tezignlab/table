import React, { useEffect, useState } from 'react'
import { useDispatch, useIntl, useSelector } from 'umi'
// import { FormikInput as Input } from '@/components/Input'
// import { Loading } from '@/components/Icons'
import { ProjectCollectionModelState } from '../../models/projectCollection'
import { useFormik, FormikProvider, Form } from 'formik'
import * as Yup from 'yup'
// import {
//   COLLECTION_DESC_MAX_LENGTH,
//   COLLECTION_NAME_MAX_LENGTH,
// } from '@/constants'

const CreateCollection: React.FC<{ showChooseModal: () => void }> = ({
  showChooseModal,
}) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const { collections, loading } = useSelector(
    ({
      projectCollection,
    }: {
      projectCollection: ProjectCollectionModelState
    }) => projectCollection,
  )
  const [created, setCreated] = useState(false)

  useEffect(() => {
    if (created) {
      showChooseModal()
    }
  }, [collections])

  const formik = useFormik({
    initialValues: {
      name: '',
      desc: '',
    },
    onSubmit: async (values: { name: string; desc: string }) => {
      setCreated(true)
      dispatch({
        type: 'projectCollection/createCollection',
        payload: { ...values },
      })
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required(
          intl.formatMessage(
            { id: 'form.validation.require' },
            { type: intl.formatMessage({ id: 'collection.name' }) },
          ),
        )
        .max(
          COLLECTION_NAME_MAX_LENGTH,
          intl.formatMessage(
            { id: 'form.validation.max' },
            { count: COLLECTION_NAME_MAX_LENGTH },
          ),
        ),
      desc: Yup.string().max(
        COLLECTION_DESC_MAX_LENGTH,
        intl.formatMessage(
          { id: 'form.validation.max' },
          { count: COLLECTION_DESC_MAX_LENGTH },
        ),
      ),
    }),
  })

  return (
    <div className="w-full h-full">
      <div className="text-bold text-xl text-black">
        {intl.formatMessage({ id: 'collection.create' })}
      </div>

      <div className="">
        <FormikProvider value={formik}>
          <Form className="pt-6 flex flex-col space-y-4">
            <Input
              placeholder={intl.formatMessage({ id: 'collection.name' })}
              id="name"
              name="name"
              type="text"
            />

            <Input
              placeholder={intl.formatMessage({ id: 'collection.desc' })}
              id="desc"
              name="desc"
              type="text"
            />
            <div className="w-full flex flex-row space-x-4">
              <button
                type="submit"
                className="btn btn-primary flex flex-row space-x-2"
                disabled={loading}
              >
                {loading && (
                  <div className="h-5 w-5">
                    <Loading />
                  </div>
                )}
                <span>{intl.formatMessage({ id: 'collection.create' })}</span>
              </button>

              {collections && collections.length > 0 && (
                <button
                  className="btn"
                  onClick={() => {
                    showChooseModal()
                  }}
                >
                  {intl.formatMessage({ id: 'general.cancel' })}
                </button>
              )}
            </div>
          </Form>
        </FormikProvider>
      </div>
    </div>
  )
}

export default CreateCollection