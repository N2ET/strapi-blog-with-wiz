import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      extact: false,
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/', component: '@/pages/index' },
        // { path: '/article/:id', component: '@/pages/article_new' },
        { path: '/article/:id', component: '@/pages/article' },
      ],
    },
  ],
  fastRefresh: {},

  proxy: {
    '/wiz-note-share': {
      target: 'http://localhost:1337',
      changeOrigin: true,
    },
    '/wapp': {
      target: 'http://localhost:1337',
      changeOrigin: true,
    },
    '/lang': {
      target: 'http://localhost:1337',
      changeOrigin: true,
    },
    '/api': {
      target: 'http://localhost:1337',
      changeOrigin: true,
    },
    '/share': {
      target: 'http://localhost:1337',
      changeOrigin: true,
    },
    '/uploads': {
      target: 'http://localhost:1337',
      changeOrigin: true,
    },
  },
});
