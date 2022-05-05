import { COLLECTION_DESC_MAX_LENGTH, COLLECTION_NAME_MAX_LENGTH } from '@/constants'
import { updateCollection } from '@/services/project'
import { Collection } from '@/types/collection'
import { Form, FormikProvider, useFormik } from 'formik'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { Loading } from '../Icons'
import { FormikInput as Input } from '../Input'
import Modal from '../Modal'

const CollectionEditModal: React.FC<{
  collection: Collection
  visible: boolean
  closeModal: () => void
  refresh: () => void
}> = ({ collection, visible, closeModal, refresh }) => {
  const { t } = useTranslation('common')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!loading && submitted) closeModal()
  }, [submitted])

  const formik = useFormik({
    initialValues: {
      name: collection ? collection.name : '',
      desc: collection ? collection.desc : '',
    },
    onSubmit: async (values) => {
      setLoading(true)
      console.log(values)

      try {
        await updateCollection(collection.id, { name: values.name, desc: values.desc ?? '' })
        setSubmitted(true)
        refresh()
      } catch {
      } finally {
        setLoading(false)
      }
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
    <Modal visible={visible} toggle={closeModal}>
      <div className="w-full h-full">
        <div className="text-bold text-xl text-black">{t('collection.edit')}</div>

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
    </Modal>
  )
}

export default CollectionEditModal
