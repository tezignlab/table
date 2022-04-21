import React, { useEffect } from 'react'
import clsx from 'clsx'
import { ProjectModelState } from '../../models/project'
import ProjectDetail from '../../components/ProjectDetail'
import { Close } from '../../components/Icons'

const ProjectModal: React.FC<{ returnUrl: string }> = ({ returnUrl }) => {
  const dispatch = useDispatch()
  const { current, currentId, currentIndex } = useSelector(
    ({ project }: { project: ProjectModelState }) => project,
  )

  useEffect(() => {
    if (currentId) {
      document.body.classList.add('overflow-y-hidden')
    } else {
      document.body.classList.remove('overflow-y-hidden')
    }
  }, [currentId])

  return (
    <div
      className={clsx(
        'fixed h-screen w-full top-0 left-0 bottom-0 right-0 overflow-y-hidden',
        'flex flex-col bg-opacity-50 bg-black',
        {
          'z-20': !!currentId,
          hidden: !currentId,
        },
      )}
    >
      <div
        className="flex-none flex justify-end h-16 cursor-pointer px-4"
        onClick={() => {
          window.history.pushState('', '', returnUrl)
          dispatch({ type: 'project/clearDetail' })
        }}
      >
        <div className="flex flex-col justify-center">
          <div className="h-8 w-8 text-gray-300 hover:text-gray-100 transition-all duration-200 ease-in-out">
            <Close />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-grow bg-white rounded-lg animate__animated animate__backInUp overflow-y-hidden">
        {!!current && <ProjectDetail index={currentIndex} project={current} />}
      </div>
    </div>
  )
}

export default ProjectModal
