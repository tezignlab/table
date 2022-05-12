import { ProjectDetail } from '@/types/project'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import ProjectDetailContent from './content'
import ProjectDetailModal from './modal'
import ProjectDetailSidebar from './sidebar'

const ProjectDetailComponent: React.FC<{
  project: ProjectDetail
  bottomVisible?: boolean
  topVisible?: boolean
}> = ({ project, bottomVisible, topVisible }) => {
  const [modalShow, setModalShow] = useState(false)
  const { t } = useTranslation('common')
  const sideContent = (
    <div className="flex flex-wrap">
      {project.tags.map((item, index) => (
        <div
          key={`${item}_${index}`}
          className="btn btn-tag mx-1 my-1"
          onClick={() => {
            window.open(`/search?query=${encodeURIComponent(item)}`, '_blank')
          }}
        >
          {item}
        </div>
      ))}
    </div>
  )

  return (
    <div className="relative w-full flex py-10 h-full">
      <ProjectDetailContent
        project={project}
        openModal={() => {
          setModalShow(true)
        }}
      />
      <ProjectDetailSidebar inModal={true} bottomVisible={bottomVisible} topVisible={topVisible}>
        {sideContent}
      </ProjectDetailSidebar>

      <ProjectDetailModal
        hidden={!modalShow}
        toggle={() => {
          setModalShow(false)
        }}
      >
        {sideContent}
      </ProjectDetailModal>
    </div>
  )
}

export default ProjectDetailComponent
