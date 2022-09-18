<script setup lang="ts">
try {
  const { data } = await $fetch('/api/refs/yuyinws/steam-card')
  console.log('🚀 ~ file: PageView.vue ~ line 4 ~ data', data)
}
catch (error) {
  console.log('🚀 ~ file: PageView.vue ~ line 7 ~ error', error)
}
</script>

<template>
  {{ $route.params }}
</template>
