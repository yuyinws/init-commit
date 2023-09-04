<script lang="ts" setup>
import type { Repository } from '~/types'

const emits = defineEmits(['repoClick'])

const toast = useToast()

const repositories = ref<Repository[]>([])

const isRepoCardShow = ref(false)
const isLoading = ref(false)

async function getRepoList(query: string) {
  try {
    isLoading.value = true
    isRepoCardShow.value = true
    const response = await $fetch(`/api/repo/list?query=${query}`)
    if (response.state === 'ok')
      repositories.value = response.data!
  }
  catch (error) {
    toast.add({ title: 'Error', description: String(error) })
  }
  finally {
    isLoading.value = false
  }
}

function handleRepoClick(repo: Repository) {
  isRepoCardShow.value = false

  emits('repoClick', repo)
}

defineExpose({
  getRepoList,
})
</script>

<template>
  <div v-if="isRepoCardShow" class="bg-white dark:bg-gray-900 absolute rounded-md top-12 shadow-sm p-2 w-[21rem] sm:w-[40rem] border border-gray-300 dark:border-gray-700">
    <div v-if="isLoading" class="w-full flex flex-col justify-center items-center">
      <div class="flex flex-col w-full gap-4 p-2">
        <div v-for="i in 10" :key="i" class="flex items-center gap-2 w-full">
          <USkeleton class="h-6 w-6" :ui="{ rounded: 'rounded-full' }" />
          <USkeleton class="h-6 flex-1" />
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col justify-center">
      <template v-if="repositories?.length > 0">
        <div
          v-for="repo in repositories"
          :key="repo.owner.login + repo.name"
          class="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm p-2 cursor-pointer"
          @click="handleRepoClick(repo)"
        >
          <div class="flex gap-2">
            <UAvatar size="xs" :src="repo.owner.avatarUrl" :alt="repo.owner.login" />
            <div class="text-sm">
              <span class="font-medium">{{ repo.owner.login }}</span>
              <span class="mx-1">/</span>
              <span class="font-medium">{{ repo.name }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="text-sm text-gray-500 text-center py-6">
          No repositories found
        </div>
      </template>
    </div>
  </div>
</template>

<style>

</style>
