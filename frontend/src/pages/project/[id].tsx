import ProjectDetailComponent from '@/components/ProjectDetail'
import { useOnScreen } from '@/hooks/useOnScreen'
import { getProjectDetail } from '@/services/project'
import { projectsState } from '@/stores/project'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import { useQuery } from 'react-query'
import { useRecoilState } from 'recoil'

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
  const [projects, setProjects] = useRecoilState(projectsState)

  const { isLoading, refetch } = useQuery(
    ['projectDetail', params.id],
    async () => {
      const result = await getProjectDetail(params.id)
      setProjects((prev) => ({
        ...prev,
        currentProject: result.data,
      }))
      return result.data
    },
    {
      cacheTime: 0,
    },
  )

  const bottomRef = useRef<HTMLDivElement>(null)
  const bottomVisible = useOnScreen(bottomRef, 1)
  const topRef = useRef<HTMLDivElement>(null)
  const topVisible = useOnScreen(topRef, 1)

  return (
    <div className="w-full">
      <div ref={topRef} />

      {!!projects.currentProject && (
        <ProjectDetailComponent
          project={projects.currentProject}
          bottomVisible={!!bottomVisible}
          topVisible={!!topVisible}
        />
      )}

      <div ref={bottomRef} />
    </div>
  )
}

export default ProjectPage
