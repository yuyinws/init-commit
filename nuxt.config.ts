// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  site: {
    url: 'https://initcommit.info/',
  },
  modules: [
    '@vueuse/nuxt',
    '@nuxt/ui',
    'unplugin-turbo-console/nuxt',
    'nuxt-og-image',
    'nuxt-time',
    'nuxt-module-cli-shortcuts',
  ],
  extends: ['nuxt-umami'],
  appConfig: {
    umami: {
      customEndpoint: '/api/send',
      version: 2,
    },
  },
  shortcuts: {
    rawMode: true,
  },
  runtimeConfig: {
    url: 'http://localhost:3000',
    github: {
      token: '',
      clientId: '',
      clientSecret: '',
    },
  },
  ogImage: {
    fonts: [
      'Inter:400',
      'Inter:700',
    ],
  },
  experimental: {
    componentIslands: true,
  },
})
