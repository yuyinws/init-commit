<script setup lang="ts">
import dayjs from 'dayjs'

const route = useRoute()
const inputText = ref('')
const isLoading = ref(false)
const errorInfo = reactive({
  isShow: false,
  message: '',
})
const suggests = ['microsoft/vscode', 'github.com/vuejs/core', 'https://github.com/microsoft/TypeScript']

function parseInput(input: string) {
  const splitArr = input.split('/')
  if (splitArr.length < 2) {
    return false
  }
  else if (splitArr.length === 2) {
    return {
      owner: splitArr[0],
      name: splitArr[1],
    }
  }
  else {
    const findGithub = splitArr.findIndex(i => i === 'github.com')
    if (findGithub > -1) {
      const owner = splitArr[findGithub + 1]
      const name = splitArr[findGithub + 2]
      return {
        owner,
        name,
      }
    }
    else {
      return false
    }
  }
}

function showError(msg: string) {
  errorInfo.isShow = true
  errorInfo.message = msg
  setTimeout(() => {
    errorInfo.isShow = false
  }, 3000)
}

const commitInfo = reactive({
  isShow: false,
  owner: '',
  name: '',
  message: '',
  date: '',
  oid: '',
  author: '',
  avatarUrl: '',
})

async function onSearch() {
  try {
    isLoading.value = true
    commitInfo.isShow = false
    const parse = parseInput(inputText.value)
    if (parse) {
      const { name, owner } = parse
      commitInfo.owner = owner
      commitInfo.name = name
      const { data } = await $fetch(`/api/refs/${owner}/${name}`)
      if (data.status === 1) {
        const defaultRef = data.results
        const { data: commitData } = await $fetch(`/api/commit/${owner}/${name}/${defaultRef}`)
        if (data.status === 1) {
          const { message, committedDate, oid, author, avatarUrl } = commitData.results
          commitInfo.message = message
          commitInfo.date = dayjs(committedDate).format('YYYY-MM-DD hh:mm:ss')
          commitInfo.oid = oid
          commitInfo.author = author.name
          commitInfo.isShow = true
          commitInfo.avatarUrl = author.avatarUrl
        }
        else {
          showError('Invalid Repo Link.')
        }
      }
      else {
        showError('Repo Not Found')
      }

      isLoading.value = false
    }
    else {
      showError('Invalid Repo Link.')
      isLoading.value = false
    }
  }
  catch (error) {
    isLoading.value = false
    showError('Unkown Error')
  }
}

function goPage() {
  const href = `https://github.com/${commitInfo.owner}/${commitInfo.name}/commit/${commitInfo.oid}`
  window.open(href, '_blank')
}

function onSuggestClick(input: string) {
  inputText.value = input
  onSearch()
}

onMounted(() => {
  const params = route.params
  if (params.owner && params.name) {
    inputText.value = `${params.owner}/${params.name}`
    onSearch()
  }
})
</script>

<template>
  <div mt-10 p-10 flex="~ col">
    <div flex="~ row wrap" items-center justify-center gap-x-20px w-full text-center text-40px mb-40px font-bold>
      <div>Find Repo's</div>
      <div class="spical">
        First Commit
      </div>
    </div>
    <div flex gap-x-20px mb-10px>
      <input
        v-model.trim="inputText" b="rd-6px 1px solid color-#d0d7de" shadow-md w-full type="text"
        placeholder="Input Repo's name here" px-12px py-8px
        dark:bg="dark"
        @keyup.enter="onSearch"
      >
      <button
        shadow-md b="rd-6px 1px solid color-#1b1f24 opacity-15" color="#ffffff" bg="#218bff" hover:bg="#2e67d3"
        relative px-20px @click="onSearch"
      >
        Search
      </button>
    </div>

    <div text-12px flex="~ wrap" color="#999" mb-10px>
      <div mr-5px>
        Suggests:
      </div>
      <div flex="~ wrap" gap-x-10px>
        <div v-for="(item, i) in suggests" :key="i" cursor-pointer hover:color="#555" @click="onSuggestClick(item)">
          {{ item }}
        </div>
      </div>
    </div>

    <div v-show="errorInfo.isShow" b="rd-6px 1px color-#cf222e opacity-50" color="#cf222e" mb-10px text-center p-y-8px>
      {{ errorInfo.message }}
    </div>
    <div v-if="commitInfo.isShow" cursor-pointer hover:shadow-md flex="~ col" gap-y-3px b="rd-6px 1px color-#d0d7de" p-y-8px p-x-16px @click="goPage">
      <div color="#24292f" dark:color="white" font-600>
        {{ commitInfo.message }}
      </div>
      <div text-12px flex items-center gap-x-5px>
        <img w-20px h-20px b-rd="50%" :src="commitInfo.avatarUrl" alt="user">
        <div font-600>
          {{ commitInfo.author }}
        </div>
        <div color="#24292f" dark:color="white">
          committed {{ commitInfo.date }}
        </div>
      </div>
    </div>
    <div v-if="isLoading" flex justify-center items-center>
      <img w-50px h-50px src="/loading.gif" alt="">
    </div>
  </div>
</template>

<style>
.spical {
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
