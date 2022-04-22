import React, { MouseEventHandler } from 'react'
import clsx from 'clsx'
import { Project } from '../../models/project'
import { FolderPlus, Like, Loading } from '../Icons'
import NeedAuthClickable from '../NeedAuthClickable'
import Clamp from 'react-multiline-clamp'
import Decoder from '../../../utils/decoder'
import { useHover } from '../../hooks/useHover'

const CardButton: React.FC<{
  handleClick: MouseEventHandler
  children: React.ReactNode
  active: boolean
  color: 'red' | 'blue'
}> = ({ handleClick, children, active, color }) => {
  return (
    <NeedAuthClickable>
      <div
        className={clsx(
          'rounded-lg h-7 w-7 p-1',
          'transition-all duration-200',
          {
            'text-gray-600 hover:text-gray-400': !active,
            'text-red-600 hover:text-red-400': color === 'red' && active,
            'text-blue-600 hover:text-blue-400': color === 'blue' && active,
          },
        )}
        onClick={handleClick}
      >
        {children}
      </div>
    </NeedAuthClickable>
  )
}

const ProjectCard: React.FC<{ project: Project; index: number }> = ({
  project,
  index,
}) => {
  const [isHovering, hoverRef] = useHover<HTMLDivElement>()
  const dispatch = useDispatch()

  const handleClick: () => void = () => {
    window.history.pushState('', '', `/project/${project.id}`)
    dispatch({
      type: 'project/getProjectDetail',
      payload: { id: project.id, index: index },
    })
  }

  return (
    <div className="w-full h-auto rounded-lg relative">
      <div className="w-full h-full flex flex-col justify-between">
        <div className="w-full h-64 rounded-lg">
          <img
            src={project.cover}
            className="h-64 w-full object-cover object-center rounded-lg"
          />
        </div>

        <div className="w-full flex flex-row justify-between py-2">
          <div className="h-full flex flex-col justify-center">
            <Clamp lines={1}>
              <div className="text-md text-black link" onClick={handleClick}>
                {Decoder.decodeHTMLText(project.title)}
              </div>
            </Clamp>
          </div>

          <div className="flex flex-row space-x-1 pl-3">
            <CardButton
              handleClick={(e) => {
                e.stopPropagation()

                dispatch({
                  type: project.is_like
                    ? 'project/unlikeProject'
                    : 'project/likeProject',
                  payload: { id: project.id, index: index },
                })
              }}
              active={project.is_like}
              color="red"
            >
              {project.like_loading ? <Loading /> : <Like />}
            </CardButton>

            <CardButton
              handleClick={(e) => {
                e.stopPropagation()

                dispatch({
                  type: 'projectCollection/getCollections',
                  payload: { id: project.id, projectIndex: index },
                })
              }}
              active={project.is_collect}
              color="blue"
            >
              {project.collect_loading ? (
                <Loading />
              ) : (
                <FolderPlus bgClassName="text-gray-300" />
              )}
            </CardButton>
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <div className="flex flex-row justify-start">
            <div className="flex flex-col justify-center">
              <img
                src={project.author.avatar}
                className="w-6 h-6 rounded-full"
              />
            </div>

            <div className="h-full flex flex-col justify-center">
              <a
                className="cursor-pointer pl-2 link"
                target="_blank"
                href={project.author.home}
                rel="noreferrer"
              >
                {project.author.name}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={hoverRef}
        className={clsx(
          'transition-all duration-300 ease-in-out rounded-lg',
          'absolute top-0 w-full h-64 cursor-pointer',
          'flex flex-col justify-end',
          {
            'opacity-0': !isHovering,
            'opacity-100': isHovering,
          },
        )}
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0.5) 100%)',
        }}
        onClick={handleClick}
      >
        <div className="flex flex-row p-4 justify-between rounded-lg"></div>
      </div>
    </div>
  )
}

export default ProjectCard
