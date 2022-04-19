import React, { useState, useEffect, useRef } from 'react'
// import { useIntl, useSelector, useDispatch, useLocation } from 'umi'
import ProjectCard from '../../components/ProjectCard'
import { Loading } from '../../components/Icons'
import ToTop from '../../components/ToTop'
import ProjectModal from '../../components/ProjectModal'
import CollectionModal from '../../components/CollectionModal'
import { Project } from '../../models/project'
import { ProjectModelState } from '../../models/project'
import { GlobalLoadingState } from '../../utils'
import { ProjectCollectionModelState } from '../../models/projectCollection'
import clsx from 'clsx'
import { CollectionModalModeType } from '../../components/CollectionModal'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useOnScreen } from '../../hooks/useOnScreen'

const ProjectList: React.FC<{ loadMore: () => void }> = ({ loadMore }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const { projects, hasMoreProjects } = useSelector(
    ({ project }: { project: ProjectModelState }) => project,
  )
  const { projectId } = useSelector(
    ({
      projectCollection,
    }: {
      projectCollection: ProjectCollectionModelState
    }) => projectCollection,
  )
  const globalLoading = useSelector(
    ({ loading }: { loading: GlobalLoadingState }) => loading,
  )
  const loading = globalLoading.models.project

  const bottomRef = useRef<HTMLDivElement>(null)
  const bottomVisible = useOnScreen(bottomRef, 1)
  const topRef = useRef<HTMLDivElement>(null)
  const topInViewPort = useOnScreen(topRef, 1)
  const [modalMode, setModalMode] = useState<CollectionModalModeType>('choose')

  useEffect(() => {
    if (hasMoreProjects && bottomVisible) {
      loadMore()
    }
  }, [bottomVisible])

  useEffect(() => {
    dispatch({ type: 'project/clear' })
  }, [router.pathname])

  useEffect(() => {
    dispatch({ type: 'project/clearDetail' })
  }, [])

  return (
    <div className="w-full flex flex-col relative">
      <div className="h-0 w-full" ref={topRef}></div>

      <div className="flex-grow bg-white lg:mt-10">
        <div className="flex-grow mx-auto w-full px-4 lg:px-16 grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-5 gap-x-8 gap-y-8">
          {projects?.map((project: Project, index: number) => {
            return <ProjectCard key={index} project={project} index={index} />
          })}
        </div>

        <div className="w-full flex flex-col justify-center h-48">
          <div className="w-full flex justify-center ">
            {loading && (
              <div className="h-5 w-5">
                <Loading color="#000000" />
              </div>
            )}
          </div>
        </div>

        {!topInViewPort && (
          <ToTop visible={!topInViewPort} atBottom={!!bottomVisible} />
        )}
      </div>

      <div className={clsx('w-full h-0 flex justify-center')} ref={bottomRef} />

      <ProjectModal returnUrl={router.pathname} />

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
    </div>
  )
}

export default ProjectList
