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
    <div class="text-5xl font-bold">
      Init Commit
    </div>
    <div class="text-lg mt-2 mb-5 text-gray-600 dark:text-gray-300">
      Find a repository's first commit
    </div>
    <div ref="inputRef" class="relative">
      <UInput
        v-model="inputContent"
        class="w-[28rem]"
        autofocus
        placeholder="Search for a repo..."
        size="xl"
        @update:model-value="onInputValUpdate"
      />

      <Repositories ref="RepositoriesRef" v-model:show="selectedRepoShow" />
    </div>
  </div>
</template>
