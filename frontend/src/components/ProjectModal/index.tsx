import { getProjectDetail } from '@/services/project'
import { projectsState } from '@/stores/project'
import { Project } from '@/types/project'
import clsx from 'clsx'
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useQuery } from 'react-query'
import { useRecoilState } from 'recoil'
import { Close } from '../Icons'
import ProjectDetail from '../ProjectDetail'

export const ProjectModal: React.FC<{ returnUrl: string; project: Project; visible: boolean; toggle: () => void }> = ({
  returnUrl,
  project,
  visible,
  toggle,
}) => {
  const [projects, setProjects] = useRecoilState(projectsState)
  const { isLoading, refetch } = useQuery(
    ['projectDetail', project.id],
    async () => {
      const result = await getProjectDetail(project.id)
      setProjects((prev) => ({
        ...prev,
        currentProject: result.data,
      }))
      return result.data
    },
    {
      cacheTime: 0,
      enabled: false,
    },
  )

  useEffect(() => {
    if (visible) {
      document.body.classList.add('overflow-y-hidden')
    } else {
      document.body.classList.remove('overflow-y-hidden')
    }
  }, [visible])

  useEffect(() => {
    if (visible) refetch()
  }, [visible])

  // return nothing on server side
  if (typeof window === 'undefined') return <div id="project-modal" />

  let modalContainer: HTMLElement | null = document.getElementById('modal-container')
  if (!modalContainer) {
    modalContainer = document.createElement('div')
    modalContainer.setAttribute('id', 'modal-container')
    document.body.appendChild(modalContainer)
  }

  return (
    <>
      {visible &&
        !isLoading &&
        createPortal(
          <div
            className={clsx(
              'fixed h-screen w-full top-0 left-0 bottom-0 right-0 overflow-y-hidden',
              'flex flex-col bg-opacity-50 bg-black',
              {
                'z-20': visible,
                'hidden': !visible,
              },
            )}
          >
            <div
              className="flex-none flex justify-end h-16 cursor-pointer px-4"
              onClick={() => {
                window.history.pushState('', '', returnUrl)
                toggle()
              }}
            >
              <div className="flex flex-col justify-center">
                <div className="h-8 w-8 text-gray-300 hover:text-gray-100 transition-all duration-200 ease-in-out">
                  <Close />
                </div>
              </div>
            </div>

            <div className="w-full flex flex-grow bg-white rounded-lg animate__animated animate__backInUp overflow-y-hidden">
              {projects.currentProject && <ProjectDetail project={projects.currentProject} />}
            </div>
          </div>,
          modalContainer,
        )}
    </>
  )
}
