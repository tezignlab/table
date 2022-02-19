import { defineConfig } from 'umi'

export default defineConfig({
  locale: {
    default: 'en-US',
  },
  metas: [{ name: 'referrer', content: 'no-referrer' }],
  mfsu: {},
  hash: true,
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/auth',
      component: '@/layouts/auth',
      routes: [
        {
          exact: true,
          path: '/auth/sign-in',
          component: '@/pages/auth/signIn',
        },
        {
          exact: true,
          path: '/auth/sign-up',
          component: '@/pages/auth/signUp',
        },
      ],
    },
    {
      path: '/account',
      component: '@/layouts/account',
      routes: [
        { exact: true, path: '/account', redirect: '/account/profile' },
        {
          exact: true,
          path: '/account/profile',
          component: '@/pages/account/profile',
        },
        {
          exact: true,
          path: '/account/password',
          component: '@/pages/account/password',
        },
      ],
    },
    {
      path: '/user/:username/collections/:id',
      exact: true,
      component: '@/layouts/basic',
      routes: [
        {
          path: '/user/:username/collections/:id',
          exact: true,
          component: '@/pages/user/[username]/collections/[id]',
        },
      ],
    },
    {
      path: '/user/:username',
      component: '@/layouts/user',
      routes: [
        { exact: true, path: '/user', redirect: '/404' },
        {
          exact: true,
          path: '/user/:username',
          redirect: '/user/:username/likes',
        },
        {
          exact: true,
          path: '/user/:username/collections',
          component: '@/pages/user/[username]/collections',
        },
        {
          exact: true,
          path: '/user/:username/inspiration',
          component: '@/pages/user/[username]/inspiration',
        },
        {
          exact: true,
          path: '/user/:username/:type',
          component: '@/pages/user/[username]/[type]',
        },
      ],
    },
    {
      path: '/',
      component: '@/layouts/basic',
      routes: [
        { exact: true, path: '/download-app', component: '@/pages/download' },
        { exact: true, path: '/search', redirect: '/search/projects' },
        { exact: true, path: '/search/:type', component: '@/pages/search' },
        {
          exact: true,
          path: '/search/:type/:query',
          component: '@/pages/search',
        },
        { exact: true, path: '/project/recommend', component: '@/pages/index' },
        { exact: true, path: '/project/:id', component: '@/pages/project/[id]' },
        { exact: true, path: '/', component: '@/pages/index' },
        { component: '@/pages/404' },
      ],
    },
  ],
  fastRefresh: {},
  proxy: {
    '/api/': {
      target: 'http://127.0.0.1:8080/',
      changeOrigin: true,
    },
    '/static/': {
      target: 'http://127.0.0.1:8080/',
      changeOrigin: true,
    },
  },
  tailwindcss: {
    tailwindCssFilePath: '@/tailwind.css',
  },
})
