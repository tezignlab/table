import {
  collectProject,
  likeProject as likeProjectService,
  unlikeProject as unlikeProjectService,
} from '@/services/project'
import { projectsState } from '@/stores/project'
import { Collection } from '@/types/collection'
import { Project } from '@/types/project'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { useRecoilState } from 'recoil'

export const useProject = (project: Project) => {
  const [projects, setProjects] = useRecoilState(projectsState)

  const updateGlobalProjects = (newProps: Partial<Project>) => {
    let newProjects = { ...projects }
    if (project.id in projects.data) {
      const newData = { ...projects.data }
      newData[project.id] = {
        ...newData[project.id],
        ...newProps,
      }
      newProjects = {
        ...newProjects,
        data: newData,
      }
    }

    if (projects.currentProject && project.id === projects.currentProject.id) {
      newProjects.currentProject = {
        ...projects.currentProject,
        ...newProps,
      }
    }

    setProjects(newProjects)
  }

  const { isFetching: likeLoading, refetch: toggleProjectLike } = useQuery(
    ['toggleLike', project.id],
    async () => {
      const serviceFunction = project.is_like ? unlikeProjectService : likeProjectService
      try {
        await serviceFunction(project.id)
        updateGlobalProjects({
          is_like: !project.is_like,
          count_like: project.count_like + (project.is_like ? -1 : 1),
        })
      } catch {}
    },
    {
      cacheTime: 0,
      enabled: false,
    },
  )

  const [collectLoading, setCollectLoading] = useState(false)
  const toggleProjectCollection = async (collection: Collection) => {
    setCollectLoading(true)
    const collected = !!project.collections.find((item) => item.id === collection.id)
    try {
      await collectProject(project.id, collection.id, collected ? 'delete' : 'post')

      let newCollections
      if (collected) {
        newCollections = project.collections.filter((item) => item.id !== collection.id)
      } else {
        newCollections = project.collections.concat(collection)
      }

      updateGlobalProjects({
        collections: newCollections,
      })
    } catch {
    } finally {
      setCollectLoading(false)
    }
  }

  return { likeLoading, toggleProjectLike, toggleProjectCollection, collectLoading }
}
