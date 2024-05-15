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
  ],
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
      {
        name: 'Cal Sans',
        weight: 600,
        path: 'https://cdn.jsdelivr.net/npm/cal-sans@1.0.1/fonts/webfonts/CalSans-SemiBold.woff',
      },
    ],
  },
  experimental: {
    componentIslands: true,
  },
})
