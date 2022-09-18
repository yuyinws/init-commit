<script setup lang="ts">
try {
  const { data } = await $fetch('/api/hello')
  console.log('🚀 ~ file: PageView.vue ~ line 4 ~ data', data)
}
catch (error) {
  console.log('🚀 ~ file: PageView.vue ~ line 7 ~ error', error)
}
</script>

<template>
  12312
</template>
