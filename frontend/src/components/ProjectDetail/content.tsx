import React, { useRef, useEffect } from 'react'
import { ProjectDetail } from '../../models/project'
import Clamp from 'react-multiline-clamp'
import NeedAuthClickable from '../NeedAuthClickable'
import { Loading } from '../Icons'
import clsx from 'clsx'
import { FolderPlus, Like, Detail } from '../Icons'
import moment from 'moment'
import { useTranslation } from 'next-i18next'

const ProjectDetailContent: React.FC<{
  project: ProjectDetail
  index?: number
  openModal: () => void
}> = ({ project, index, openModal }) => {
  const { t } = useTranslation('common')
  const dispatch = useDispatch()
  const contentRef = useRef<HTMLDivElement>(null)

  // for image with data-original attribute
  // we need to replace src with it when scroll to it
  useEffect(() => {
    if (contentRef.current) {
      Array.from(contentRef.current.getElementsByTagName('img')).forEach(
        (img: HTMLImageElement) => {
          if (img.getAttribute('data-original') !== null) {
            img.src = img.getAttribute('data-original') || ''
          }
        },
      )
    }
  }, [])

  const timestamp = moment(new Date(project.publish_time)).format('YYYY-MM-DD')

  const likeButton = (
    <NeedAuthClickable>
      <button
        className={clsx('btn flex flex-row h-full', {
          'btn-active': project.is_like && !project.like_loading,
          'btn-gray': !project.is_like || project.like_loading,
        })}
        onClick={() => {
          dispatch({
            type: project.is_like
              ? 'project/unlikeProject'
              : 'project/likeProject',
            payload: { index: index, id: project.id },
          })
        }}
        disabled={project.like_loading}
      >
        <div className="h-full flex flex-col justify-center">
          <div className="h-4 w-4 mr-2">
            {project.like_loading ? <Loading color="black" /> : <Like />}
          </div>
        </div>

        {project.is_like ? project.count_like : t('general.like')}
      </button>
    </NeedAuthClickable>
  )

  const collectButton = (
    <NeedAuthClickable>
      <button
        className={clsx('btn flex flex-row h-full', {
          'btn-gray': !project.is_collect || project.collect_loading,
          'btn-active': project.is_collect && !project.collect_loading,
        })}
        onClick={() => {
          // open collections modal
          dispatch({
            type: 'projectCollection/getCollections',
            payload: {
              id: project.id,
              projectIndex: index,
            },
          })
        }}
        disabled={project.collect_loading}
      >
        <div className="h-full flex flex-col justify-center">
          <div className="h-4 w-4 mr-2">
            <FolderPlus bgClassName="text-gray-300" />
          </div>
        </div>

        {t('general.collect')}
      </button>
    </NeedAuthClickable>
  )

  return (
    <div className="w-full flex overflow-y-scroll">
      <div className="w-full lg:w-2/3 px-4 lg:px-32 space-y-8 lg:space-y-16">
        <div className="mx-auto w-full  flex flex-col lg:flex-row justify-between lg:space-x-16">
          <div className="flex-shrink flex flex-col lg:flex-row lg:space-x-4 lg:h-16">
            <img
              className="w-1/4 lg:w-auto lg:h-full"
              src={project.author.avatar}
            />

            <div className="flex flex-col-reverse lg:flex-col justify-between">
              <div className="text-lg font-bold pt-2 lg:pt-0">
                <Clamp lines={2}>{project.title}</Clamp>
              </div>

              <div className="w-auto">
                <a
                  className="link py-2 lg:py-0 w-auto"
                  href={project.author.home}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.author.name}
                </a>
              </div>
            </div>
          </div>

          <div
            className={clsx(
              'w-full flex flex-col justify-start',
              'lg:flex-none lg:w-56 lg:justify-center',
            )}
          >
            <div
              className={clsx(
                'flex flex-row justify-between pt-4 space-x-4',
                'lg:pt-0 lg:justify-end',
              )}
            >
              <div className="flex flex-row justify-start space-x-4">
                {likeButton}
                {collectButton}
              </div>
              <div
                className={clsx('btn btn-gray lg:hidden ')}
                onClick={() => {
                  openModal()
                }}
              >
                <Detail />
              </div>
            </div>
          </div>
        </div>

        <div
          ref={contentRef}
          className="w-full overflow-x-hidden lg:w-3/4 lg:mx-auto detail-content"
        >
          <div className="flex flex-row">
            <span className="text-gray-500 pr-2">{t('general.origin')}</span>
            <a
              className="link"
              href={project.origin_url}
              target="_blank"
              rel="noreferrer"
            >
              {project.origin}
            </a>

            <span className="text-gray-500 pr-2 pl-4">
              {t('general.publish')}
            </span>
            {timestamp}
          </div>

          <div
            className="w-full detail-content"
            dangerouslySetInnerHTML={{ __html: project.content }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailContent
