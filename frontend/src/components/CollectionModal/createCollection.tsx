import { createCollection } from '@/services/project'
import { Collection } from '@/types/collection'
import { Form, FormikProvider, useFormik } from 'formik'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { COLLECTION_DESC_MAX_LENGTH, COLLECTION_NAME_MAX_LENGTH } from '../../constants'
import { Loading } from '../Icons'
import { FormikInput as Input } from '../Input'

const CreateCollection: React.FC<{ collections: Collection[]; showChooseModal: () => void; refresh: () => void }> = ({
  collections,
  showChooseModal,
  refresh,
}) => {
  const { t } = useTranslation('common')
  const [created, setCreated] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!loading && created) {
      refresh()
      showChooseModal()
    }
  }, [loading])

  const formik = useFormik({
    initialValues: {
      name: '',
      desc: '',
    },
    onSubmit: async (values: { name: string; desc: string }) => {
      setLoading(true)
      try {
        await createCollection(values.name, values.desc)
        setCreated(true)
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
    <div className="w-full h-full">
      <div className="text-bold text-xl text-black">{t('collection.create')}</div>

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
                <span>{t('collection.create')}</span>
              </button>

              {collections && collections.length > 0 && (
                <button
                  className="btn"
                  onClick={() => {
                    showChooseModal()
                  }}
                >
                  {t('general.cancel')}
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
