import authModule from '../src/module'

export default {
  server: {
    port: 5000,
    host: 'localhost'
  },
  publicRuntimeConfig: {
    apiHost: process.env.API_HOST
  },
  privateRuntimeConfig: {},
  build: {
    extractCSS: true
  },
  plugins: ['~/plugins/axios'],
  serverMiddleware: [
    '~/api/auth',
    '~/api/oauth2mockserver'
  ],
  buildModules: [
    '@nuxt/typescript-build'
  ],
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    authModule,
    '@nuxtjs/proxy'
  ],
  axios: {
    proxy: true,
    retry: {
      retries: 3
    },
    baseURL: process.env.API_HOST
  },
  proxy: {
    '/api': {
      target: 'http://multi-auth.test',
      pathRewrite: {
        '^/api': '/'
      },
      ws: true
    }
  },
  auth: {
    redirect: {
      callback: '/callback',
      logout: '/signed-out'
    },
    strategies: {
      local: {
        token: {
          property: 'access_token',
          required: true,
          type: 'Bearer'
        },
        user: {
          property: 'user',
          autoFetch: true
        },
        endpoints: {
          login: { url: '/api/admins/login', method: 'post' },
          logout: { url: '/api/admins/logout', method: 'post' },
          user: { url: '/api/admins/user', method: 'get' }
        }
      }
    },
    plugins: [{ src: '~/plugins/axios', ssr: true }]
  }
}
