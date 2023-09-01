<script setup lang="ts">
import { debounce } from 'lodash-es'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { Commit, Repository } from '~/types'

dayjs.extend(relativeTime)

const inputVal = ref('')
const isLoading = ref(false)
const isCommitLoading = ref(false)
const isRepoCardShow = ref(false)
const selectedRepo = ref<Repository>()
const repositories = ref<Repository[]>([])

const initialCommit = ref<Commit>()

const onInputValUpdate = debounce(async (event) => {
  try {
    if (!event)
      return

    selectedRepo.value = undefined
    isRepoCardShow.value = false
    repositories.value = []
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

async function handleRepoClick(repo: Repository) {
  try {
    isRepoCardShow.value = false
    selectedRepo.value = repo
    isCommitLoading.value = true
    inputVal.value = `${repo.owner.login}/${repo.name}`
    const response = await $fetch('/api/commit', {
      method: 'POST',
      body: {
        owner: repo.owner.login,
        name: repo.name,
      },
    })

    initialCommit.value = response.data
  }
  catch (error) {

  }
  finally {
    isCommitLoading.value = false
  }
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
        Find the <span class="font-semibold">initial commit</span> of a repository.
      </h2>
    </div>
    <div class="flex w-full gap-2 justify-center mt-10">
      <div class="relative">
        <UInput
          v-model="inputVal"
          placeholder="Input to search a repository"
          size="lg" class="w-[20rem] sm:w-[40rem]"
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
        <div v-if="isRepoCardShow" class="bg-white dark:bg-gray-900 absolute rounded-md top-12 shadow-sm p-2 w-[20rem] sm:w-[40rem] border border-gray-300 dark:border-gray-700">
          <div v-if="isLoading" class="w-full flex flex-col justify-center h-20 items-center">
            <UIcon name="i-mdi-loading" class="text-gray-500 dark:text-gray-400 animate-spin h-8 w-8" />
            <div class="text-sm text-gray-500 mt-2">
              fetching repositories...
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

        <div v-if="selectedRepo" class="bg-white dark:bg-gray-900 absolute rounded-md top-12 shadow-sm p-3 w-[20rem] sm:w-[40rem] border border-gray-300 dark:border-gray-700">
          <div v-if="isCommitLoading" class="w-full flex flex-col justify-center h-20 items-center">
            <UIcon name="i-mdi-loading" class="text-gray-500 dark:text-gray-400 animate-spin h-8 w-8" />
            <div class="text-sm text-gray-500 mt-2">
              fetching initial commit...
            </div>
          </div>

          <template v-else>
            <NuxtLink
              target="_blank"
              class="hover:underline hover:text-blue-500"
              :to="`https://github.com/${selectedRepo.owner.login}/${selectedRepo.name}/commit/${initialCommit?.oid}`"
            >
              <div class="text-sm font-semibold">
                {{ initialCommit?.message }}
              </div>
            </NuxtLink>

            <div class="flex text-sm items-center gap-2 mt-1">
              <UAvatar size="xs" :src="initialCommit?.author.avatarUrl" />
              <NuxtLink
                target="_blank"
                class="hover:underline hover:text-blue-500"
                :to="`https://github.com/${selectedRepo.owner.login}`"
              >
                <div class="font-medium">
                  {{ initialCommit?.author.name }}
                </div>
              </NuxtLink>

              <div class="text-gray-500">
                committed {{ dayjs(initialCommit?.committedDate).fromNow() }}
              </div>
            </div>
          </template>
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
