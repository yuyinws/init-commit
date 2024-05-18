<script setup lang="ts">
import { toPng } from 'html-to-image'

const route = useRoute()
const { owner, name } = route.params

useSeoMeta({
  title: `init-commit.info - @${owner}/${name}`,
})

useServerSeoMeta({
  ogTitle: `init-commit.info - @${owner}/${name}`,
  twitterTitle: `init-commit.info - @${owner}/${name}`,
  description: `The first commit of ${owner}/${name} on GitHub`,
  ogDescription: `The first commit of ${owner}/${name} on GitHub`,
  twitterCard: 'summary_large_image',
})

const { data } = useFetch('/api/commit', {
  method: 'POST',
  body: {
    owner,
    name,
  },
})

const { data: repoInfo } = useFetch('/api/repo/info', {
  params: {
    owner,
    name,
  },
})

const commitMeta = computed(() => {
  return data.value?.data?.commit
})

const defaultBranch = computed(() => {
  return data.value?.data?.branchs.defaultRef
})

const avatarUrl = computed(() => {
  return repoInfo.value?.data?.ownerAvatarUrl
})

const shareUrl = computed(() => {
  const message = `Check out ${owner}/${name}'s first commit on GitHub`
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${message}\n\nhttps://comm1t.yuy1n.io/${owner}/${name}`)}`
})

defineOgImageComponent(
  'Commit',
  {
    commitMeta,
    avatarUrl,
    owner,
    name,
    defaultBranch,
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
</script>

<template>
  <div>
    <div v-if="commitMeta" class="flex flex-col justify-center mt-20 h-full items-center p-5">
      <div class="max-w-[500px]">
        <nuxt-link
          :to="`https://github.com/${owner}/${name}/commit/${commitMeta.oid}`"
          target="_blank"
          class="mt-80"
        >
          <div ref="cardRef">
            <UCard>
              <div class="flex">
                <div>
                  <div class="flex items-center gap-1 text-sm">
                    <div class="text-gray-800 dark:text-gray-200 font-medium">
                      {{ `${owner}/${name}` }}
                    </div>
                  </div>

                  <div class="font-semibold text-2xl my-2">
                    {{ commitMeta.message }}
                  </div>

                  <div class="flex items-center gap-2 text-xs mt-1">
                    <div class="flex items-center">
                      <UIcon name="i-ion:git-branch" class="text-gray-500" />
                      <div class="text-gray-500">
                        {{ data?.data?.branchs.defaultRef }}
                      </div>
                    </div>
                    <div class="flex items-center gap-1 ">
                      <UIcon name="i-radix-icons-commit" class="text-gray-500" />
                      <div class="text-gray-500">
                        {{ commitMeta.abbreviatedOid }}
                      </div>
                    </div>
                  </div>

                  <div class="flex gap-3 text-[13px] mt-2">
                    <div class="flex items-center gap-3">
                      <div class="text-gray-500 flex items-center gap-1">
                        <UIcon name="i-radix-icons-file" />
                        {{ formatNumber(commitMeta.changedFilesIfAvailable) }} files changed
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="text-gray-500 flex items-center gap-1">
                        <UIcon name="i-radix-icons-file-plus" />
                        {{ formatNumber(commitMeta.additions) }} lines additions
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center text-sm gap-1 mt-10">
                    <img class="w-5 h-5 rounded-full" :src="commitMeta.author.avatarUrl" alt="">
                    <div class="font-medium">
                      {{ commitMeta.author.name }}
                    </div>
                    <div class="text-gray-500">
                      first commited on
                      <NuxtTime
                        style="font-family: Cal Sans;"
                        :datetime="commitMeta.committedDate"
                        year="numeric"
                        month="long"
                        day="numeric"
                        locale="en-US"
                      />
                    </div>
                  </div>
                </div>
                <div class="flex flex-shrink-0 font-semibold text-gray-400 gap-1">
                  <img class="w-20 h-20 rounded-xl" :src="repoInfo?.data?.ownerAvatarUrl" alt="">
                </div>
              </div>
            </UCard>
          </div>
        </nuxt-link>

        <div class="flex justify-between w-full">
          <nuxt-link :to="shareUrl" target="_blank">
            <UButton
              icon="i-ri:twitter-x-fill"
              size="lg"
              color="black"
              variant="solid"
              label="Share"
              :trailing="false"
              class="mt-5"
            />
          </nuxt-link>

          <UButton
            icon="i-radix-icons:image"
            size="lg"
            color="gray"
            variant="solid"
            label="Save"
            :trailing="false"
            class="mt-5"
            @click="saveAsPng"
          />

          <nuxt-link to="/">
            <UButton
              icon="i-radix-icons:github-logo"
              size="lg"
              color="primary"
              variant="solid"
              label="Find another"
              :trailing="false"
              class="mt-5"
            />
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>
