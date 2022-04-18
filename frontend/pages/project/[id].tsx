import { useParams, useSelector, useDispatch } from 'umi'
import React, { useEffect, useState } from 'react'
import ProjectDetailComponent from '@/components/ProjectDetail'
import { ProjectModelState } from '@/models/project'
import { ProjectCollectionModelState } from '@/models/projectCollection'
import CollectionModal from '@/components/CollectionModal'
import { CollectionModalModeType } from '@/components/CollectionModal'
import { useInViewport } from '@umijs/hooks'

const ProjectPage: React.FC = () => {
  const params = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const [modalMode, setModalMode] = useState<CollectionModalModeType>('choose')
  const { current } = useSelector(({ project }: { project: ProjectModelState }) => project)
  const { projectId } = useSelector(
    ({ projectCollection }: { projectCollection: ProjectCollectionModelState }) =>
      projectCollection,
  )

  const [topVisible, topRef] = useInViewport<HTMLDivElement>()
  const [bottomVisible, bottomRef] = useInViewport<HTMLDivElement>()

  useEffect(() => {
    dispatch({ type: 'project/getProjectDetail', payload: { id: params.id } })
  }, [])

  return (
    <div className="w-full">
      <div ref={topRef} />

      {!!current && (
        <ProjectDetailComponent
          project={current}
          inModal={false}
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
