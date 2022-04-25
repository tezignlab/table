import { useTranslation } from 'next-i18next'
import React, { Fragment, useState } from 'react'
import { ProjectDetail } from '../../models/project'
import ProjectDetailContent from './content'
import ProjectDetailModal from './modal'
import ProjectDetailSidebar from './sidebar'

const ProjectDetailComponent: React.FC<{
  project: ProjectDetail
  index?: number
  bottomVisible?: boolean
  topVisible?: boolean
}> = ({ project, index, bottomVisible, topVisible }) => {
  /**
   * this component is possible to exist in list page
   * and `like` or `collect` function will affect the value of project list
   * so `index` is to identify which project in list will be affected
   */
  const [modalShow, setModalShow] = useState(false)
  const { t } = useTranslation('common')
  const sideContent = (
    <div className="flex flex-col space-y-8">
      {project.tags.map((tag, index) => (
        <Fragment key={index}>
          {tag.data.length > 0 && (
            <div key={tag.type} className="flex flex-col space-y-2">
              <div className="font-bold text-md mx-1">{t(`project.tag.${tag.type}`)}</div>

              <div className="flex flex-wrap">
                {tag.data.map((item) => (
                  <div
                    key={item}
                    className="btn btn-tag mx-1 my-1"
                    onClick={() => {
                      window.open(`/search/projects/${item}`, '_blank')
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  )

  return (
    <div className="relative w-full flex py-10 h-full">
      <ProjectDetailContent
        project={project}
        index={index}
        openModal={() => {
          setModalShow(true)
        }}
      />
      <ProjectDetailSidebar inModal={!!index} bottomVisible={bottomVisible} topVisible={topVisible}>
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
