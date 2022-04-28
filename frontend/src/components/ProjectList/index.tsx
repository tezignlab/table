import { IDefaultPageDataReturnType } from '@/services'
import { authUserState } from '@/stores/auth'
import { projectsState } from '@/stores/project'
import { Project } from '@/types/project'
import clsx from 'clsx'
import React, { useEffect, useRef } from 'react'
import { useInfiniteQuery, useQueryClient } from 'react-query'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { useOnScreen } from '../../hooks/useOnScreen'
import { Loading } from '../Icons'
import ProjectCard from '../ProjectCard'
import ToTop from '../ToTop'

const LIST_DEFAULT_LIMIT = 9

const ProjectList: React.FC<{
  name: string
  loadMore: ({ skip, limit }: { skip: number; limit: number }) => Promise<IDefaultPageDataReturnType<Project>>
}> = ({ name, loadMore }) => {
  const authUser = useRecoilValue(authUserState)
  const [projects, setProjects] = useRecoilState(projectsState)
  const resetProjects = useResetRecoilState(projectsState)
  const queryClient = useQueryClient()

  useEffect(() => {
    resetProjects()

    return () => {
      resetProjects()
      queryClient.invalidateQueries(name)
    }
  }, [])

  const fetchItems = async ({
    pageParam = {
      skip: 0,
      limit: LIST_DEFAULT_LIMIT,
    },
  }) => {
    const result = await loadMore({ skip: pageParam.skip, limit: pageParam.limit })
    return result
  }

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery(
    [name, 'items', authUser?.id], // add id to query key, so when user login or logout, the cache will be cleared
    fetchItems,
    {
      getNextPageParam: (lastPage, _) => {
        if (!lastPage.data.has_more) return undefined

        return {
          limit: lastPage.data.limit,
          skip: lastPage.data.skip + lastPage.data.limit,
        }
      },
    },
  )

  const bottomRef = useRef<HTMLDivElement>(null)
  const bottomVisible = useOnScreen(bottomRef, 1)
  const topRef = useRef<HTMLDivElement>(null)
  const topInViewPort = useOnScreen(topRef, 1)

  useEffect(() => {
    if (!data || !data.pages || data.pages.length === 0) return

    setProjects((prev) => {
      const newData: Record<string, Project> = {}
      data.pages.forEach((page) => {
        page.data.data.forEach((item) => {
          newData[item.id] = item
        })
      })
      return {
        ...prev,
        data: newData,
        hasMoreProjects: data.pages[data.pages.length - 1].data.has_more,
      }
    })
  }, [data])

  useEffect(() => {
    if (bottomVisible && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [bottomVisible, hasNextPage, isFetching])

  return (
    <div className="w-full flex flex-col relative">
      <div className="h-0 w-full" ref={topRef}></div>

      <div className="flex-grow bg-white lg:mt-10">
        <div className="flex-grow mx-auto w-full px-4 lg:px-16 grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-5 gap-x-8 gap-y-8">
          {Object.values(projects.data).map((item) => (
            <ProjectCard project={item} key={item.id} />
          ))}
        </div>

        <div className="w-full flex flex-col justify-center h-48">
          <div className="w-full flex justify-center ">
            {(isFetching || isFetchingNextPage) && (
              <div className="h-5 w-5">
                <Loading color="#000000" />
              </div>
            )}
          </div>
        </div>

        {!topInViewPort && <ToTop visible={!topInViewPort} atBottom={!!bottomVisible} />}
      </div>

      <div className={clsx('w-full h-0 flex justify-center')} ref={bottomRef} />
    </div>
  )
}

export default ProjectList
