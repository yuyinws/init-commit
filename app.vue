<script setup lang="ts">
useHead({
  title: 'Comm1t',
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
  ],
  meta: [
    { name: 'description', content: 'Find the initial commit of a repository.' },
  ],
})

useSeoMeta({
  title: 'Comm1t',
  ogTitle: 'Comm1t',
  description: 'Find the initial commit of a repository.',
  ogDescription: 'Find the initial commit of a repository.',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>
