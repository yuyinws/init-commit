<script setup lang="ts">
import type { Repositories } from '#build/components'
import type { Repository } from '~/types'

const toast = useToast()
const inputContent = ref('')
const RepositoriesRef = ref<InstanceType<typeof Repositories>>()

const selectedRepo = ref<Repository>()

const onInputValUpdate = useDebounceFn(async (event: string) => {
  try {
    if (!event)
      return

    selectedRepo.value = undefined
    RepositoriesRef.value?.getRepoList(event)
  }
  catch (error) {
    toast.add({ title: 'Error', description: String(error) })
  }
}, 500)

defineOgImageComponent('NuxtSeo')
</script>

<template>
  <div class="flex mt-[15rem] justify-center flex-col items-center">
    <div class="text-5xl font-bold">
      Init Commit
    </div>
    <div class="text-lg mt-5 mb-10 text-gray-600 dark:text-gray-300">
      Find a repository's first commit
    </div>
    <div class="relative">
      <UInput
        v-model="inputContent"
        class="w-[25rem]"
        placeholder="Search for a repo..."
        size="xl"
        @update:model-value="onInputValUpdate"
      />

      <Repositories ref="RepositoriesRef" @repo-click="() => {}" />
    </div>
  </div>
</template>
