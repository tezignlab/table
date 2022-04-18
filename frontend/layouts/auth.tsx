import React, { ReactNode, useEffect } from 'react'
import {
  history,
  useIntl,
  Helmet,
  useSelector,
  useDispatch,
  Link,
  useLocation,
} from 'umi'
import { AuthModelState } from '@/models/auth'
import { GlobalLoadingState } from '@/utils'
import { notification } from '@/components/Notification'
import { Project, ProjectModelState } from '@/models/project'
import Layout from '@/layouts/index'
import { Loading } from '@/components/Icons'
import { Logo, LogoWhite } from '@/components/Images'

const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const auth = useSelector(({ auth }: { auth: AuthModelState }) => auth)
  const location = useLocation()
  const globalLoading = useSelector(
    ({ loading }: { loading: GlobalLoadingState }) => loading,
  )
  const authLoading = globalLoading.models.auth

  const { projects } = useSelector(({ project }: { project: ProjectModelState }) => project)

  useEffect(() => {
    if (auth.user) {
      history.push('/')
    }
  }, [auth.user])

  useEffect(() => {
    if (auth.error) {
      notification('error', intl.formatMessage({ id: auth.message }), 1000)
      dispatch({ type: 'auth/clearNotification' })
    }

    if (auth.success && !!auth.message) {
      notification('success', intl.formatMessage({ id: auth.message }), 1000)
      dispatch({ type: 'auth/clearNotification' })
    }
  }, [auth.error, auth.success])

  useEffect(() => {
    dispatch({
      type: 'project/getProjects',
      payload: {
        skip: 0,
        limit: 12,
        type: 'recommend',
      },
    })
  }, [])

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          {`${intl.formatMessage({
            id: 'auth.welcome',
          })} | ${intl.formatMessage({ id: 'site.name' })}`}
        </title>
      </Helmet>

      <div className="top-0 bottom-0 hidden lg:flex flex-wrap z-0 h-screen w-screen overflow-x-hidden overflow-y-hidden">
        {projects &&
          projects.map((project: Project, index: number) => (
            <img
              key={index}
              className="h-1/3 w-1/4 object-cover object-center"
              src={project.cover}
            />
          ))}
      </div>

      <div className="absolute top-0 min-h-screen lg:h-screen w-screen lg:grid lg:grid-cols-2 lg:bg-black lg:bg-opacity-70 z-10">
        <div className="col-span-1 h-full w-full bg-transparent text-white text-center flex-col justify-center hidden lg:flex">
          <LogoWhite className="mx-auto h-20 object-fill text-white" />
        </div>

        <div className="py-8 lg:col-span-1 min-h-screen w-full px-4 lg:px-0 lg:mx-auto bg-transparent relative flex flex-col justify-center">
          <div className="mb-8 w-full flex justify-center lg:hidden">
            <Logo className="w-16 object-fill lg:ml-8"/>
          </div>

          <div className="h-full lg:h-auto w-full lg:max-w-xl lg:mx-auto flex flex-col justify-center lg:p-16 bg-white rounded-lg">
            {!auth.requested && authLoading ? (
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
                    <div className='text-center'>
                      <Link className="link link-active" to="/auth/sign-in">
                        {intl.formatMessage({ id: 'auth.tradition.sign_in' })}
                      </Link>
                    </div>
                  )}

                  {location.pathname !== '/auth/sign-up' && (
                    <div className='text-center'>
                      <Link className="link link-active" to="/auth/sign-up">
                        {intl.formatMessage({ id: 'auth.tradition.sign_up' })}
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

export default AuthLayout
