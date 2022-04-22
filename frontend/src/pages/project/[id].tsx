import React, { useEffect, useRef, useState } from 'react'
import ProjectDetailComponent from '../../components/ProjectDetail'
import { ProjectModelState } from '../../models/project'
import { ProjectCollectionModelState } from '../../models/projectCollection'
import CollectionModal from '../../components/CollectionModal'
import { CollectionModalModeType } from '../../components/CollectionModal'
import { useOnScreen } from '../../hooks/useOnScreen'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? '')),
    },
  }
}
const ProjectPage: React.FC = () => {
  const router = useRouter()
  const params = router.query as { id: string }

  const dispatch = useDispatch()
  const [modalMode, setModalMode] = useState<CollectionModalModeType>('choose')
  const { current } = useSelector(
    ({ project }: { project: ProjectModelState }) => project,
  )
  const { projectId } = useSelector(
    ({
      projectCollection,
    }: {
      projectCollection: ProjectCollectionModelState
    }) => projectCollection,
  )

  const bottomRef = useRef<HTMLDivElement>(null)
  const bottomVisible = useOnScreen(bottomRef, 1)
  const topRef = useRef<HTMLDivElement>(null)
  const topVisible = useOnScreen(topRef, 1)

  useEffect(() => {
    dispatch({ type: 'project/getProjectDetail', payload: { id: params.id } })
  }, [])

  return (
    <div className="w-full">
      <div ref={topRef} />

      {!!current && (
        <ProjectDetailComponent
          project={current}
          // inModal={false}
          bottomVisible={!!bottomVisible}
          topVisible={!!topVisible}
        />
      )}

      <CollectionModal
        visible={!!projectId}
        mode={modalMode}
        closeModal={() => {
          dispatch({
            type: 'projectCollection/clear',
          })
          setModalMode('choose')
        }}
        changeModalMode={(mode: CollectionModalModeType) => {
          setModalMode(mode)
        }}
      />

      <div ref={bottomRef} />
    </div>
  )
}

export default ProjectPage
