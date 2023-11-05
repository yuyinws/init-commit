<script setup lang="ts">
import { debounce } from 'lodash-es'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { Commit, Repository } from '~/types'
import Repositories from '~/components/Repositories.vue'

dayjs.extend(relativeTime)

const toast = useToast()

const inputVal = ref('')
const isCommitLoading = ref(false)
const isBranchsLoading = ref(false)
const selectedRepo = ref<Repository>()

const RepositoriesRef = ref<InstanceType<typeof Repositories>>()

const initialCommit = ref<Commit>()

const branchs = ref<string[]>()
const selectedBranch = ref<string>()
const defaultBranch = ref('')

const onInputValUpdate = debounce(async (event: string) => {
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

async function getBranchAndCommit(repo: Repository) {
  try {
    selectedRepo.value = repo
    isCommitLoading.value = true
    inputVal.value = `${repo.owner.login}/${repo.name}`

    await getBranchs()
    await getInitialCommit()
  }
  catch (error) {
    toast.add({
      title: 'Error',
      description: String(error),
    })
  }
  finally {
    isCommitLoading.value = false
  }
}

async function getBranchs() {
  try {
    isBranchsLoading.value = true
    const refResponse = await $fetch('/api/refs', {
      method: 'POST',
      body: {
        owner: selectedRepo.value?.owner.login,
        name: selectedRepo.value?.name,
      },
    })

    branchs.value = refResponse.data!.refs
    selectedBranch.value = refResponse.data!.defaultRef
    defaultBranch.value = refResponse.data!.defaultRef
  }
  catch (error) {
    toast.add({
      title: 'Error',
      description: String(error),
    })
  }
  finally {
    isBranchsLoading.value = false
  }
}

async function getInitialCommit() {
  try {
    isCommitLoading.value = true
    const response = await $fetch('/api/commit', {
      method: 'POST',
      body: {
        owner: selectedRepo.value?.owner.login,
        name: selectedRepo.value?.name,
        ref: selectedBranch.value,
      },
    })

    initialCommit.value = response.data
  }
  catch (error) {
    toast.add({
      title: 'Error',
      description: String(error),
    })
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
    <div class="flex w-[21rem] sm:w-[40rem] gap-2 justify-center mt-10">
      <div class="relative w-full">
        <UInput
          v-model="inputVal"
          placeholder="Input to search a repository"
          size="lg" class="w-full"
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
        <Repositories ref="RepositoriesRef" @repoClick="getBranchAndCommit" />

        <div v-if="selectedRepo" class="bg-white dark:bg-gray-900 absolute rounded-md top-12 shadow-sm p-3 w-[21rem] sm:w-[40rem] border border-gray-300 dark:border-gray-700">
          <div v-if="isBranchsLoading">
            <USkeleton class="h-8 w-[15rem]" />
          </div>
          <div v-else class="max-w-[20rem] min-w-[15rem] flex items-center gap-2">
            <UIcon class="flex-shrink-0" name="i-mdi-source-branch" />
            <div class="flex-1">
              <USelectMenu v-model="selectedBranch" :options="branchs" searchable @update:model-value="getInitialCommit" />
            </div>
            <UBadge v-if="defaultBranch === selectedBranch">
              default
            </UBadge>
          </div>
          <div class="w-full border-b my-2 border-gray-200 dark:border-gray-700" />

          <div v-if="isCommitLoading">
            <USkeleton class="h-5 w-[17rem]" />
            <div class="flex items-center gap-2 mt-2">
              <USkeleton class="h-6 w-6" :ui="{ rounded: 'rounded-full' }" />
              <USkeleton class="h-5 w-[15rem]" />
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
                :to="`https://github.com/${initialCommit?.author?.user?.login}`"
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
