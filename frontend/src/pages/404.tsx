import { GetStaticProps } from 'next'
import NotFound from '../components/NotFound'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? '')),
    },
  }
}

const NotFoundPage = () => {
  return <NotFound />
}

export default NotFoundPage