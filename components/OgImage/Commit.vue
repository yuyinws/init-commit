<script setup lang="ts">
import type { Commit } from '~/types'

defineProps<{
  commitMeta: Commit['commit']
  avatarUrl: string
  owner: string
  name: string
  defaultBranch: string
}>()
</script>

<template>
  <div class="font-sans px-16 py-24 h-full w-full">
    <div class="flex flex-col w-full justify-between h-full">
      <div class="flex w-full flex-row justify-between">
        <div class="max-w-[52rem]">
          <div class="text-gray-800  font-medium text-4xl">
            {{ `${owner}/${name}` }}
          </div>
          <div class="text-6xl font-bold mt-4">
            {{ commitMeta.message }}
          </div>
          <div class="flex flex-row mt-4 gap-5">
            <div class="flex flex-row gap-2 items-center text-3xl text-gray-500">
              <UIcon name="i-ion:git-branch" />
              {{ defaultBranch }}
            </div>
            <div class="flex flex-row gap-2 items-center text-3xl text-gray-500">
              <UIcon name="i-radix-icons-commit" />
              {{ commitMeta.abbreviatedOid }}
            </div>
          </div>

          <div class="flex flex-row mt-4 gap-5">
            <div class="flex flex-row gap-2 items-center text-3xl text-gray-500">
              <UIcon name="i-radix-icons-file" />
              {{ formatNumber(commitMeta.changedFilesIfAvailable) }} files changed
            </div>
            <div class="flex flex-row gap-2 items-center text-3xl text-gray-500">
              <UIcon name="i-radix-icons-file-plus" />
              {{ formatNumber(commitMeta.additions) }} lines additions
            </div>
          </div>
        </div>
        <img class="w-[13rem] h-[13rem] rounded-3xl flex-shrink-0" :src="avatarUrl" alt="">
      </div>

      <div class="flex flex-row gap-2 items-center mt-10 text-3xl">
        <img class="w-10 h-10 rounded-full" :src="commitMeta.author.avatarUrl" alt="">
        <div class="font-semibold mr-1">
          {{ commitMeta.author.name }}
        </div>
        <div class="text-gray-500 flex flex-row gap-1">
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
  </div>
</template>
