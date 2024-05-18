// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  site: {
    url: 'http://localhost:3000',
  },
  modules: [
    '@vueuse/nuxt',
    '@nuxt/ui',
    'unplugin-turbo-console/nuxt',
    'nuxt-og-image',
    'nuxt-time',
    'nuxt-module-cli-shortcuts',
  ],
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
