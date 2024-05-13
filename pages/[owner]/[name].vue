<script setup lang="ts">
import type { Commit, Repository } from '~/types'

const route = useRoute()
const { owner, name } = route.params

// const isCommitLoading = ref(false)
// const isBranchsLoading = ref(false)

// const branchs = ref<string[]>()
// const selectedBranch = ref<string>()
// const defaultBranch = ref('')
// const initialCommit = ref<Commit>()
// async function getBranchs() {
//   try {
//     isBranchsLoading.value = true

//     const refResponse = await $fetch('/api/refs', {
//       method: 'POST',
//       body: {
//         owner,
//         name,
//       },
//     })

//     branchs.value = refResponse.data!.refs
//     selectedBranch.value = refResponse.data!.defaultRef
//     defaultBranch.value = refResponse.data!.defaultRef
//   }
//   catch (error) {
//     toast.add({
//       title: 'Error',
//       description: String(error),
//     })
//   }
//   finally {
//     isBranchsLoading.value = false
//   }
// }

// async function getInitialCommit() {
//   try {
//     isCommitLoading.value = true
//     const response = await $fetch('/api/commit', {
//       method: 'POST',
//       body: {
//         owner,
//         name,
//         ref: selectedBranch.value,
//       },
//     })

//     initialCommit.value = response.data
//   }
//   catch (error) {
//     toast.add({
//       title: 'Error',
//       description: String(error),
//     })
//   }
//   finally {
//     isCommitLoading.value = false
//   }
// }

// onMounted(async () => {
//   await getBranchs()
//   await getInitialCommit()
// })

// const { data } = await useAsyncData('test', async () => {
//   const [branchs, commit] = await Promise.all([
//     $fetch('/api/refs', {
//       method: 'POST',
//       body: {
//         owner,
//         name,
//       },
//     }),

//     $fetch('/api/commit', {
//       method: 'POST',
//       body: {
//         owner,
//         name,
//         ref: 'master',
//       },
//     }),
//   ])

//   return {
//     branchs,
//     commit,
//   }
// })

const { data } = useFetch('/api/commit', {
  method: 'POST',
  body: {
    owner,
    name,
  },
})

const commitMeta = computed(() => {
  return data.value?.data?.commit
})

defineOgImageComponent(
  'Commit',
  {
    data: data as any,
  },
)
</script>

<template>
  <div>
    <div v-if="commitMeta" class="flex flex-col items-center">
      <nuxt-link
        :to="`https://github.com/${owner}/${name}/commit/${commitMeta.oid}`"
        target="_blank"
      >
        <UCard class="w-[500px] mt-80">
          <div class="flex">
            <div>
              <div class="flex items-center gap-2 text-sm">
                <div class="text-gray-500">
                  {{ `${owner}/${name}` }}
                </div>
                <div class="flex items-center font-bold">
                  <UIcon name="i-ion:git-branch" class="text-gray-500" />
                  <div class="text-gray-500">
                    {{ data?.data?.branchs.defaultRef }}
                  </div>
                </div>
              </div>

              <div class="font-semibold text-2xl mt-1">
                {{ commitMeta.message }}
              </div>

              <div class="flex gap-3 text-[13px]">
                <div class="flex items-center mt-2 gap-3">
                  <div class="text-gray-500 flex items-center gap-1">
                    <UIcon name="i-radix-icons-file" />
                    {{ formatNumber(commitMeta.changedFilesIfAvailable) }} files changed
                  </div>
                </div>
                <div class="flex items-center mt-2 gap-3">
                  <div class="text-gray-500 flex items-center gap-1">
                    <UIcon name="i-radix-icons-file-plus" />
                    {{ formatNumber(commitMeta.additions) }} lines additions
                  </div>
                </div>
              </div>

              <div class="flex items-center text-sm gap-1 mt-10">
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
                <UIcon name="i-radix-icons-commit" class="text-gray-500" />
                <div class="text-gray-500">
                  {{ commitMeta.abbreviatedOid }}
                </div>
              </div>
            </div>
            <div class="flex font-semibold text-gray-400 gap-1">
              <div class="text-xl">
                #
              </div>
              <div class="text-3xl">
                1
              </div>
            </div>
          </div>
        </UCard>
      </nuxt-link>
    </div>
  </div>
</template>
