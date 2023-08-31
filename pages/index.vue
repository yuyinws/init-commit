<script setup lang="ts">
import { debounce } from 'lodash-es'

const inputVal = ref('')
const isLoading = ref(false)
const isRepoCardShow = ref(false)
const selectedRepo = ref<Repository>()
const repositories = ref<Repository[]>([])

const onInputValUpdate = debounce(async (event) => {
  try {
    if (!event) {
      isRepoCardShow.value = false
      repositories.value = []
      return
    }
    isLoading.value = true
    isRepoCardShow.value = true
    const response = await $fetch(`/api/repo/list?query=${event}`)
    if (response.state === 'ok')
      repositories.value = response.data!
  }
  catch (error) {

  }
  finally {
    isLoading.value = false
  }
}, 500)

function handleRepoClick(repo: Repository) {
  isRepoCardShow.value = false
  selectedRepo.value = repo
  // inputVal.value = repo.full_name
}
</script>

<template>
  <div class="flex flex-col justify-center items-center p-10">
    <div class="text-center">
      <h1 class="text-5xl font-bold title">
        Comm1t
      </h1>
      <h2
        class="text-gray-500 dark:text-gray-200 text-xl"
        style="text-wrap: balance"
      >
        Retrieve the initial commit of the repository.
      </h2>
    </div>
    <div class="flex w-full gap-2 justify-center mt-20">
      <div class="relative">
        <UInput
          v-model="inputVal"
          placeholder="Input to search a repository"
          size="lg" class="w-[16rem] sm:w-[40rem]"
          :ui="{ icon: { trailing: { pointer: '' } } }"
          @update:model-value="onInputValUpdate"
        >
          <template #trailing>
            <UButton
              v-show="inputVal !== ''"
              color="gray"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click="inputVal = ''"
            />
          </template>
        </UInput>
        <div v-if="(isLoading || repositories.length > 0) && isRepoCardShow" class="absolute rounded-md top-12 shadow-sm p-4 w-[16rem] sm:w-[40rem] border border-gray-300">
          <div v-if="isLoading" class="w-full flex justify-center h-20 items-center">
            <UIcon name="i-mdi-loading" class="animate-spin h-8 w-8" />
          </div>
          <div v-else class="flex flex-col justify-center">
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
          </div>
        </div>

        <div v-if="selectedRepo" class="absolute rounded-md top-12 shadow-sm p-4 w-[16rem] sm:w-[40rem] border border-gray-300">
          {{ selectedRepo }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.title {
  background: -webkit-linear-gradient(315deg, #00dfd8 25%, #007cf0);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  background-size: 400% 400%;
  animation: gradient 12s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
