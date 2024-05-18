<script setup lang="ts">
import type { Repositories } from '#build/components'
import type { Repository } from '~/types'

const toast = useToast()
const inputContent = ref('')
const RepositoriesRef = ref<InstanceType<typeof Repositories>>()

const selectedRepo = ref<Repository>()

defineOgImageComponent('NuxtSeo')

const selectedRepoShow = ref(false)
const inputRef = ref()
onClickOutside(inputRef, () => {
  selectedRepoShow.value = false
})

const onInputValUpdate = useDebounceFn(async (event: string) => {
  try {
    if (!event) {
      selectedRepoShow.value = false
      return
    }

    selectedRepo.value = undefined
    RepositoriesRef.value?.getRepoList(event)
  }
  catch (error) {
    toast.add({ title: 'Error', description: String(error) })
  }
}, 500)
</script>

<template>
  <div class="flex mt-[10rem] justify-center flex-col items-center">
    <h1 class="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
      Init Commit
    </h1>
    <p class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300">
      Find a repository's first commit
    </p>
    <div ref="inputRef" class="relative mt-5">
      <UInput
        v-model="inputContent"
        icon="i-radix-icons-github-logo"
        class="w-[28rem]"
        variant="outline"
        color="gray"
        autofocus
        placeholder="Search a GitHub repository …"
        size="xl"
        @update:model-value="onInputValUpdate"
      >
        <template #trailing>
          <UIcon name="i-radix-icons-magnifying-glass" />
        </template>
      </UInput>

      <Repositories ref="RepositoriesRef" v-model:show="selectedRepoShow" />
    </div>
  </div>
</template>
