<script setup lang="ts">
</script>

<template>
  <header class="px-3 flex items-center justify-between bg-background/75 backdrop-blur border-b border-gray-200 dark:border-gray-800 -mb-px sticky top-0 z-50">
    <NuxtLink class="flex items-center" target="_blank" to="https://github.com/yuyinws/comm1t">
      <UIcon
        name="i-mdi-github"
        class="h-5 w-5"
      />
    </NuxtLink>
    <ModeToggle />
  </header>
</template>
