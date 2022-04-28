import { Project, ProjectDetail } from '@/types/project'
import { atom } from 'recoil'

export interface ProjectState {
  data: Record<string, Project>
  hasMoreProjects?: boolean
  currentProject?: ProjectDetail
}

export const projectsState = atom<ProjectState>({
  key: 'project',
  default: {
    data: {},
    hasMoreProjects: true,
    currentProject: undefined,
  },
})
