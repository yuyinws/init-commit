// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  site: {
    url: 'https://initcommit.info/',
  },
  devServer: {
    port: 3003,
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
      ignoreLocalhost: true,
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
  nitro: {
    prerender: {
      routes: ['/'],
    },
  },
  $production: {
    routeRules: {
      '/**': { isr: true },
      '/api/**': { isr: false },
    },
  },
})
