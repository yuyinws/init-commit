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

const { data, pending, error, refresh } = await useAsyncData(`${owner}/${name}/${currentBranch.value}`, async () => {
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
  const url = currentBranch.value === defaultBranch.value ? `https://initcommit.info/${owner}/${name}` : `https://initcommit.info/${owner}/${name}/${encodeURIComponent(currentBranch.value)}`
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${message}\n\n${url}`)}`
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
    <div v-if="pending" class="w-[400px] sm:w-[560px] lg:w-[640px]">
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
          </div>

          <USkeleton class="h-20 w-20 flex-shrink-0" :ui="{ rounded: 'rounded-xl' }" />
        </div>
        <div class="mt-10 flex items-center gap-2">
          <USkeleton class="h-5 w-5" :ui="{ rounded: 'rounded-full' }" />
          <USkeleton class="h-4 w-[285px]" />
        </div>
      </UCard>
    </div>

    <div v-else-if="error" class="w-[400px] sm:w-[500px]">
      <UCard>
        <template #header>
          Ops! Something went wrong
        </template>
        <p class="text-red-500">
          {{ error }}
        </p>
        <template #footer>
          <div class="flex justify-between">
            <nuxt-link to="/">
              <UButton label="Go back" icon="i-tabler-arrow-left" color="gray" />
            </nuxt-link>

            <UButton label="Try again" icon="i-tabler-reload" color="gray" @click="refresh" />

            <nuxt-link target="_blank" to="https://github.com/yuyinws/init-commit/issues/new">
              <UButton label="Report issue" icon="i-tabler-file-report" color="gray" />
            </nuxt-link>
          </div>
        </template>
      </UCard>
    </div>

    <div v-else class="w-[400px] sm:w-[560px] lg:w-[640px]">
      <div class="mb-3">
        <UButton
          to="/"
          icon="i-radix-icons:chevron-left"
          color="gray"
          variant="ghost"
          label="Find another"
          :trailing="false"
        />
      </div>

      <div class="flex w-full mb-7">
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

        <div class="flex-1" />

        <UButton
          icon="i-radix-icons:image"
          size="lg"
          color="gray"
          variant="solid"
          label="Save as PNG"
          class="mr-3"
          :trailing="false"
          @click="saveAsPng"
        />

        <UButton
          :to="shareUrl" target="_blank"
          icon="i-ri:twitter-x-fill"
          size="lg"
          color="black"
          variant="solid"
          label="Share"
          :trailing="false"
        />
      </div>

      <GlareCard>
        <div ref="cardRef">
          <UCard class="bg-slate-950 dark:bg-slate-950 text-gray-200">
            <div class="flex justify-between">
              <div>
                <div class="flex items-center font-medium text-[15px]">
                  <NuxtLink
                    :to="`https://github.com/${owner}/${name}`" target="_blank"
                    class="hover:underline"
                  >
                    {{ `${owner}/${name}` }}
                  </NuxtLink>
                </div>

                <NuxtLink
                  :to="`https://github.com/${owner}/${name}/commit/${commitMeta!.oid}`" target="_blank"
                  class="font-semibold text-[32px] mb-1 w-[290px] line-clamp-3 hover:underline"
                >
                  {{ commitMeta!.message }}
                </NuxtLink>

                <div class="flex items-center gap-2 text-[13px] mt-1">
                  <div class="flex items-center gap-1">
                    <UIcon name="i-ion:git-branch" class="text-gray-400" />
                    <div class="text-gray-400 truncate max-w-[150px]">
                      {{ currentBranch }}
                    </div>
                  </div>
                  <NuxtLink
                    :to="`https://github.com/${owner}/${name}/commit/${commitMeta!.oid}`" target="_blank"
                    class="flex items-center gap-1 hover:underline"
                  >
                    <UIcon name="i-radix-icons-commit" class="text-gray-400" />
                    <div class="text-gray-400">
                      {{ commitMeta!.abbreviatedOid }}
                    </div>
                  </NuxtLink>
                </div>

                <div class="flex gap-3 text-[13px] mt-2">
                  <div class="flex items-center gap-3">
                    <div class="text-gray-400 flex items-center gap-1">
                      <UIcon name="i-radix-icons-file" />
                      {{ formatNumber(commitMeta!.changedFilesIfAvailable) }} files changed
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="text-gray-400 flex items-center gap-1">
                      <UIcon name="i-radix-icons-file-plus" />
                      {{ formatNumber(commitMeta!.additions) }} lines additions
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-shrink-0 font-semibold text-gray-400 gap-1">
                <img class="w-20 h-20 rounded-xl" :src="avatarUrl" alt="">
              </div>
            </div>
            <div class="h-[60px]" />
            <div class="flex flex-wrap items-center text-sm sm:text-base gap-1 mt-10">
              <img class="w-5 h-5 rounded-full" :src="commitMeta!.author.avatarUrl" alt="">
              <NuxtLink
                :to="`https://github.com/${commitMeta!.author.user.login}`" target="_blank"
                class="font-medium hover:underline"
              >
                {{ commitMeta!.author.name }}
              </NuxtLink>
              <div class="text-gray-400">
                initial commited on
              </div>
              <NuxtTime
                class="font-medium"
                :datetime="commitMeta!.committedDate"
                year="numeric"
                month="long"
                day="numeric"
                locale="en-US"
              />
            </div>
          </UCard>
        </div>
      </GlareCard>
    </div>
  </div>
</template>
