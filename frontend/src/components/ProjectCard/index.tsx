import { useProject } from '@/hooks/useProject'
import { Project } from '@/types/project'
import { withAuth } from '@/utils/withAuth'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { MouseEventHandler, useState } from 'react'
import Clamp from 'react-multiline-clamp'
import { useHover } from '../../hooks/useHover'
import Decoder from '../../utils/decoder'
import CollectionsModal, { CollectionModalModeType } from '../CollectionModal'
import { FolderPlus, Like, Loading } from '../Icons'
import { ProjectModal } from '../ProjectModal'

const CardButtonBasic: React.FC<{
  onClick: MouseEventHandler
  children: React.ReactNode
  active: boolean
  color: 'red' | 'blue'
}> = ({ onClick, children, active, color }) => {
  return (
    <div
      className={clsx('rounded-lg h-7 w-7 p-1', 'transition-all duration-200', 'cursor-pointer', {
        'text-gray-600 hover:text-gray-400': !active,
        'text-red-600 hover:text-red-400': color === 'red' && active,
        'text-blue-600 hover:text-blue-400': color === 'blue' && active,
      })}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const CardButton = withAuth(CardButtonBasic)

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [isHovering, hoverRef] = useHover<HTMLDivElement>()
  const { toggleProjectLike, likeLoading } = useProject(project)
  const [modalVisible, setModalVisible] = useState(false)
  const [collectionVisible, setCollectionVisible] = useState(false)
  const [collectionMode, setCollectionMode] = useState<CollectionModalModeType>('choose')
  const router = useRouter()

  const handleClick: () => void = () => {
    window.history.pushState('', '', `/project/${project.id}`)
    setModalVisible(true)
  }

  return (
    <div className="w-full h-auto rounded-lg relative">
      <div className="w-full h-full flex flex-col justify-between">
        <div className="w-full h-64 rounded-lg">
          <img
            referrerPolicy="no-referrer"
            src={project.cover}
            className="h-64 w-full object-cover object-center rounded-lg"
            alt=""
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
              onClick={(e) => {
                e.stopPropagation()
                toggleProjectLike()
              }}
              active={project.is_like}
              color="red"
            >
              {likeLoading ? <Loading /> : <Like />}
            </CardButton>

            <CardButton
              onClick={(e) => {
                e.stopPropagation()
                setCollectionVisible(true)
              }}
              active={project.collections.length > 0}
              color="blue"
            >
              {/* {project.collect_loading ? <Loading /> : <FolderPlus bgClassName="text-gray-300" />} */}
              <FolderPlus bgClassName="text-gray-300" />
            </CardButton>
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <div className="flex flex-row justify-start">
            <div className="flex flex-col justify-center">
              <img referrerPolicy="no-referrer" src={project.author.avatar} className="w-6 h-6 rounded-full" />
            </div>

            <div className="h-full flex flex-col justify-center">
              <a className="cursor-pointer pl-2 link" target="_blank" href={project.author.home} rel="noreferrer">
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

      <ProjectModal
        project={project}
        visible={modalVisible}
        returnUrl={router.pathname}
        toggle={() => setModalVisible(false)}
      />

      <CollectionsModal
        project={project}
        mode={collectionMode}
        visible={collectionVisible}
        closeModal={() => setCollectionVisible(false)}
        changeModalMode={(mode) => {
          setCollectionMode(mode)
        }}
      />
    </div>
  )
}

export default ProjectCard
