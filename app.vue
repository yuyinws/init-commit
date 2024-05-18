<script setup lang="ts">
useHead({
  title: 'Init Commit',
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
  ],
  meta: [
    { name: 'description', content: 'Find the initial commit of a repository.' },
  ],
})

useSeoMeta({
  title: 'Init Commit',
  ogTitle: 'Init Commit',
  description: 'Find the initial commit of a repository.',
  ogDescription: 'Find the initial commit of a repository.',
})
</script>

<template>
  <UNotifications />
  <main class="min-h-screen">
    <app-header />
    <NuxtPage />
  </main>
</template>
