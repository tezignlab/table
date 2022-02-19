import request from 'umi-request'
import { ACCESS_TOKEN_NAME } from '@/constants'

// 定义全局request拦截器，完成两个操作：
// 1. 非开发环境添加service_url作为前缀
// 2. 将token添加到请求头中
request.interceptors.request.use((url, options) => {

  const accessToken = localStorage
    .getItem(ACCESS_TOKEN_NAME)
    ?.replace(/[^a-zA-Z0-9.\-_]/g, '')

  return {
    url,
    options: {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  }
})
