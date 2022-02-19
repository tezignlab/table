import React, { useState, useEffect } from 'react'
import { useIntl, useDispatch, useSelector } from 'umi'
import { FormikInput as Input } from '@/components/Input'
import { useFormik, FormikProvider, Form } from 'formik'
import * as Yup from 'yup'
import {
  COLLECTION_DESC_MAX_LENGTH,
  COLLECTION_NAME_MAX_LENGTH,
} from '@/constants'
import { CollectionModelState } from '@/models/collection'
import { Loading } from '@/components/Icons'

const EditCollection: React.FC<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  const intl = useIntl()
  const dispatch = useDispatch()

  const { current, loading } = useSelector(
    ({ collection }: { collection: CollectionModelState }) => collection,
  )

  const [submitted, setSubmitted] = useState<boolean>(false)

  useEffect(() => {
    if (!loading && submitted) {
      closeModal()
    }
  }, [loading])

  const formik = useFormik({
    initialValues: {
      name: current ? current.name : '',
      desc: current ? current.desc : '',
    },
    onSubmit: async (values) => {
      dispatch({
        type: 'collection/updateCollection',
        payload: { id: current?.id, data: values },
      })
      setSubmitted(true)
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
        {intl.formatMessage({ id: 'collection.edit' })}
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
                <span>{intl.formatMessage({ id: 'general.update' })}</span>
              </button>

              <button className="btn btn-gray" onClick={closeModal}>
                {intl.formatMessage({ id: 'general.cancel' })}
              </button>
            </div>
          </Form>
        </FormikProvider>
      </div>
    </div>
  )
}

export default EditCollection
