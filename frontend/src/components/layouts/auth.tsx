import React, { ReactNode, useEffect } from 'react'
import { notification } from '../Notification'
import Layout from './index'
import { Loading } from '../Icons'
import { Logo, LogoWhite } from '../Images'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useRecoilValue } from 'recoil'
import { authStatusState, currentUserStatusState } from '@/stores/auth'
import { Project } from '@/stores/project'
import { getRecommendProjects } from '@/services/project'
import { useQuery } from 'react-query'
export const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation('common')
  const router = useRouter()

  const authStatus = useRecoilValue(authStatusState)
  const authUser = useRecoilValue(currentUserStatusState)
  const { data: recommendProjects } = useQuery(['recommendProjects'], async () => {
    const result = await getRecommendProjects(0,12)
    return result.data
  })
  useEffect(() => {
    if (authUser.user) {
      router.push('/')
    }
  }, [authUser])

  useEffect(() => {
    if (authStatus.error) {
      notification('error', t(authStatus.message), 1000)
      // TODO dispatch({ type: 'auth/clearNotification' })
    }

    if (authStatus.success && !!authStatus.message) {
      notification('success', t(authStatus.message), 1000)
      // TODO dispatch({ type: 'auth/clearNotification' })
    }
  }, [authStatus.error, authStatus.success])

  return (
    <Layout>
      <Head>
        <meta charSet="utf-8" />
        <title>{`${t('auth.welcome')} | ${t('site.name')}`}</title>
      </Head>

      <div className="top-0 bottom-0 hidden lg:flex flex-wrap z-0 h-screen w-screen overflow-x-hidden overflow-y-hidden">
        {recommendProjects &&
        recommendProjects.map((project: Project, index: number) => (
            <img
              key={index}
              className="h-1/3 w-1/4 object-cover object-center"
              src={project.cover}
            />
          ))}
          {/* TODO add projects */}
      </div>

      <div className="absolute top-0 min-h-screen lg:h-screen w-screen lg:grid lg:grid-cols-2 lg:bg-black lg:bg-opacity-70 z-10">
        <div className="col-span-1 h-full w-full bg-transparent text-white text-center flex-col justify-center hidden lg:flex">
          <LogoWhite className="mx-auto h-20 object-fill text-white" />
        </div>

        <div className="py-8 lg:col-span-1 min-h-screen w-full px-4 lg:px-0 lg:mx-auto bg-transparent relative flex flex-col justify-center">
          <div className="mb-8 w-full flex justify-center lg:hidden">
            <Logo className="w-16 object-fill lg:ml-8" />
          </div>

          <div className="h-full lg:h-auto w-full lg:max-w-xl lg:mx-auto flex flex-col justify-center lg:p-16 bg-white rounded-lg">
            {!authStatus.requested? (
              <div className="w-full h-full flex flex-col justify-center">
                <div className="mx-auto h-5 w-5">
                  <Loading />
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col justify-center text-center lg:text-left">
                {children}
                <div className="flex flex-col space-y-2 w-full mx-auto mt-6 pt-6 lg:pt-0 border-t lg:border-0">
                  {location.pathname !== '/auth/sign-in' && (
                    <div className="text-center">
                      <Link href="/auth/sign-in">
                        <a className="link link-active">
                          {t('auth.tradition.sign_in')}
                        </a>
                      </Link>
                    </div>
                  )}

                  {location.pathname !== '/auth/sign-up' && (
                    <div className="text-center">
                      <Link href="/auth/sign-up">
                        <a className="link link-active">
                          {t('auth.tradition.sign_up')}
                        </a>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
