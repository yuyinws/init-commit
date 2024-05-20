<script setup lang="ts">
import { toPng } from 'html-to-image'
import { useRouteParams } from '@vueuse/router'

const route = useRoute()

const { owner, name, all } = route.params

useSeoMeta({
  title: `initial commit of @${owner}/${name}`,
})

useServerSeoMeta({
  ogTitle: `init-commit.info - @${owner}/${name}`,
  twitterTitle: `init-commit.info - @${owner}/${name}`,
  description: `The initial commit of ${owner}/${name} on GitHub`,
  ogDescription: `The initial commit of ${owner}/${name} on GitHub`,
  twitterCard: 'summary_large_image',
})

const currentBranch = ref(all?.[0] || '')
const defaultBranch = ref('')
const branchs = ref<{ name: string, default: boolean }[]>([])

const { data, pending, error } = await useAsyncData('commitInfo', async () => {
  const _branch = currentBranch.value || '_'
  const [commit, repoinfo] = await Promise.all([
    $fetch(`/api/${owner}/${name}/${encodeURIComponent(_branch)}/commit`),
    $fetch('/api/repo/info', {
      params: {
        owner,
        name,
      },
    }),
  ])

  return {
    commit,
    repoinfo,
  }
}, {
  lazy: true,
})

const commitMeta = computed(() => {
  return data.value?.commit.data?.commit
})

watch(data, (val) => {
  if (val) {
    currentBranch.value = currentBranch.value || val?.commit.data?.branchs.defaultRef || ''
    defaultBranch.value = val?.commit.data?.branchs.defaultRef || ''
    branchs.value = (val?.commit.data?.branchs.refs || []).map((item) => {
      return {
        name: item,
        default: item === val?.commit.data?.branchs.defaultRef,
      }
    })
  }
}, { immediate: true })

const avatarUrl = computed(() => {
  return data.value?.repoinfo.data?.ownerAvatarUrl
})

const shareUrl = computed(() => {
  const message = `Check out ${owner}/${name}'s initial commit on GitHub`
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${message}\n\nhttps://initcommit.info/${owner}/${name}`)}`
})

defineOgImageComponent(
  'Commit',
  {
    commitMeta,
    avatarUrl,
    owner,
    name,
    currentBranch,
  },
)

const cardRef = ref()

async function saveAsPng() {
  try {
    const imgBase64 = await toPng(cardRef.value)
    const a = document.createElement('a')
    a.href = imgBase64
    a.download = `${owner}/${name}.png`
    a.click()
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}

const _allParams = useRouteParams('all')

function handleBranchUpdate(branch: string) {
  if (branch === _allParams.value?.[0] || (_allParams.value === '' && branch === defaultBranch.value))
    return
  _allParams.value = branch === defaultBranch.value ? '' : [branch]
}
</script>

<template>
  <div class="flex flex-col justify-center mt-20 h-full items-center p-5">
    <div v-if="pending" class="w-[400px] sm:w-[500px]">
      <div class="flex justify-between w-full mb-5">
        <USkeleton class="h-10 w-[141px]" />
        <USkeleton class="h-10 w-[96px]" />
      </div>

      <UCard>
        <div class="flex">
          <div class="w-full">
            <div class="space-y-2">
              <USkeleton class="h-4 w-[100px]" />
              <USkeleton class="h-6 w-[200px]" />
              <USkeleton class="h-4 w-[100px]" />
              <USkeleton class="h-4 w-[200px]" />
            </div>
            <div class="mt-10 flex items-center gap-2">
              <USkeleton class="h-5 w-5" :ui="{ rounded: 'rounded-full' }" />
              <USkeleton class="h-4 w-[85px]" />
            </div>
          </div>

          <USkeleton class="h-20 w-20 flex-shrink-0" :ui="{ rounded: 'rounded-xl' }" />
        </div>
      </UCard>

      <div class="flex justify-between w-full mt-5">
        <USkeleton class="h-10 w-[141px]" />
        <USkeleton class="h-10 w-[141px]" />
      </div>
    </div>

    <div v-else-if="error" class="w-[400px] sm:w-[500px]">
      <UCard class="text-red-500">
        {{ error }}
      </UCard>
    </div>

    <div v-else class="w-[400px] sm:w-[500px]">
      <div class="flex justify-between w-full mb-5">
        <USelectMenu
          :model-value="currentBranch"
          searchable
          option-attribute="name"
          value-attribute="name"
          icon="i-ion:git-branch"
          class="min-w-[141px] max-w-[230px]"
          size="lg"
          :options="branchs"
          @update:model-value="handleBranchUpdate"
        >
          <template #option="{ option }">
            <div class="truncate">
              {{ option.name }}
            </div>
            <UBadge v-if="option.default" color="gray" variant="solid">
              Default
            </UBadge>
          </template>

          <template #label>
            <div class="truncate">
              <span class="mr-3">
                {{ currentBranch }}
              </span>
              <UBadge v-if="currentBranch === defaultBranch" color="gray" variant="solid">
                Default
              </UBadge>
            </div>
          </template>
        </USelectMenu>

        <nuxt-link :to="shareUrl" target="_blank">
          <UButton
            icon="i-ri:twitter-x-fill"
            size="lg"
            color="black"
            variant="solid"
            label="Share"
            :trailing="false"
          />
        </nuxt-link>
      </div>

      <nuxt-link
        :to="`https://github.com/${owner}/${name}/commit/${commitMeta!.oid}`"
        target="_blank"
        class="mt-80"
      >
        <div ref="cardRef">
          <UCard>
            <div class="flex justify-between">
              <div>
                <div class="flex items-center gap-1 text-sm">
                  <div class="text-gray-800 dark:text-gray-200 font-medium">
                    {{ `${owner}/${name}` }}
                  </div>
                </div>

                <div class="font-semibold text-2xl my-2">
                  {{ commitMeta!.message }}
                </div>

                <div class="flex items-center gap-2 text-xs mt-1">
                  <div class="flex items-center gap-1">
                    <UIcon name="i-ion:git-branch" class="text-gray-500" />
                    <div class="text-gray-500 truncate max-w-[150px]">
                      {{ currentBranch }}
                    </div>
                  </div>
                  <div class="flex items-center gap-1 ">
                    <UIcon name="i-radix-icons-commit" class="text-gray-500" />
                    <div class="text-gray-500">
                      {{ commitMeta!.abbreviatedOid }}
                    </div>
                  </div>
                </div>

                <div class="flex gap-3 text-[13px] mt-2">
                  <div class="flex items-center gap-3">
                    <div class="text-gray-500 flex items-center gap-1">
                      <UIcon name="i-radix-icons-file" />
                      {{ formatNumber(commitMeta!.changedFilesIfAvailable) }} files changed
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="text-gray-500 flex items-center gap-1">
                      <UIcon name="i-radix-icons-file-plus" />
                      {{ formatNumber(commitMeta!.additions) }} lines additions
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap items-center text-sm gap-1 mt-10">
                  <img class="w-5 h-5 rounded-full" :src="commitMeta!.author.avatarUrl" alt="">
                  <div class="font-medium">
                    {{ commitMeta!.author.name }}
                  </div>
                  <div class="text-gray-500">
                    initial commited on
                    <NuxtTime
                      style="font-family: Cal Sans;"
                      :datetime="commitMeta!.committedDate"
                      year="numeric"
                      month="long"
                      day="numeric"
                      locale="en-US"
                    />
                  </div>
                </div>
              </div>
              <div class="flex flex-shrink-0 font-semibold text-gray-400 gap-1">
                <img class="w-20 h-20 rounded-xl" :src="avatarUrl" alt="">
              </div>
            </div>
          </UCard>
        </div>
      </nuxt-link>

      <div class="flex justify-between w-full mt-5">
        <UButton
          icon="i-radix-icons:image"
          size="lg"
          color="gray"
          variant="solid"
          label="Save as PNG"
          :trailing="false"
          @click="saveAsPng"
        />

        <nuxt-link to="/">
          <UButton
            icon="i-radix-icons:github-logo"
            size="lg"
            color="gray"
            variant="solid"
            label="Find another"
            :trailing="false"
          />
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
