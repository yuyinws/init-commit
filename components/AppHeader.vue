<script setup lang="ts">
</script>

<template>
  <header class="flex justify-end gap-2 p-2">
    <NuxtLink class="flex items-center" target="_blank" to="https://github.com/yuyinws/comm1t">
      <UButton
        icon="i-radix-icons:github-logo"
        color="gray"
        variant="ghost"
        aria-label="Theme"
      />
    </NuxtLink>
    <ModeToggle />
  </header>
</template>
