import { Form, FormikProvider, useFormik } from 'formik'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { COLLECTION_DESC_MAX_LENGTH, COLLECTION_NAME_MAX_LENGTH } from '../../constants'
import { CollectionModelState } from '../../models/collection'
import { Loading } from '../Icons'
import { FormikInput as Input } from '../Input'

const EditCollection: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const { t } = useTranslation('common')
  const dispatch = useDispatch()

  const { current, loading } = useSelector(({ collection }: { collection: CollectionModelState }) => collection)

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
        .required(t('form.validation.require'))
        .max(
          COLLECTION_NAME_MAX_LENGTH,
          `${t('form.validation.max.prefix')}${COLLECTION_NAME_MAX_LENGTH}${t('form.validation.max.suffix')}`,
        ),
      desc: Yup.string().max(
        COLLECTION_DESC_MAX_LENGTH,
        `${t('form.validation.max.prefix')}${COLLECTION_DESC_MAX_LENGTH}${t('form.validation.max.suffix')}`,
      ),
    }),
  })

  return (
    <div className="w-full h-full">
      <div className="text-bold text-xl text-black">{t('collection.edit')}</div>

      <div className="">
        <FormikProvider value={formik}>
          <Form className="pt-6 flex flex-col space-y-4">
            <Input placeholder={t('collection.name')} id="name" name="name" type="text" />

            <Input placeholder={t('collection.desc')} id="desc" name="desc" type="text" />
            <div className="w-full flex flex-row space-x-4">
              <button type="submit" className="btn btn-primary flex flex-row space-x-2" disabled={loading}>
                {loading && (
                  <div className="h-5 w-5">
                    <Loading />
                  </div>
                )}
                <span>{t('general.update')}</span>
              </button>

              <button className="btn btn-gray" onClick={closeModal}>
                {t('general.cancel')}
              </button>
            </div>
          </Form>
        </FormikProvider>
      </div>
    </div>
  )
}

export default EditCollection
