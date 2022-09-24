<script setup lang="ts">
import dayjs from 'dayjs'

const route = useRoute()
const inputText = ref('')
const isLoading = ref(false)
const errorInfo = reactive({
  isShow: false,
  message: '',
})

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
          commitInfo.date = dayjs(committedDate).format('MM/DD/YYYY')
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

const searchResult = reactive({
  isShow: false,
  data: [],
})

watchEffect(() => {
  if (inputText.value.length === 0)
    searchResult.isShow = false
})

const onInput = useDebounceFn((event: any) => {
  const input = event.target.value
  if (input)
    searchRepo(input)
}, 500)

function searchRepo(str: string) {
  searchResult.isShow = true
  searchResult.data = []
  commitInfo.isShow = false
  $fetch(`https://api.github.com/search/repositories?q=${str}&sort=stars&order=desc&per_page=10`).then((res: any) => {
    const items = res.items.map((i: any) => i.full_name)
    if (items.length) {
      searchResult.data = items
    }
    else {
      searchResult.isShow = false
      showError('Not Found')
    }
  }).catch(() => {
    showError('Something Wrong:(')
    searchResult.isShow = false
  })
}

function onSelect(str: string) {
  inputText.value = str
  searchResult.isShow = false
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
      <div w-full relative>
        <input
          v-model.trim="inputText" b="rd-6px 1px solid color-#d0d7de" w-full type="text"
          placeholder="Input Repo's name here" px-12px py-8px
          dark:bg="#222222"
          shadow-md
          @input="onInput"
          @keyup.enter="onSearch"
        >
        <div
          v-if="searchResult.isShow"
          w-full
          top-50px
          b="rd-2px 1px solid color-#d0d7de"
          shadow-md
          bg-white
          dark:bg="#222222"
          absolute
          max-h-300px
          overflow-auto
          z-10
        >
          <div v-if="searchResult.data?.length === 0" color="#888" h-100px text-center leading-100px>
            Loading...
          </div>
          <div v-else flex="~ col">
            <div
              v-for="item in searchResult.data" :key="item"
              hover:bg="#f5f7fa"
              dark:hover="bg-#888"
              p-2 w-full
              @click="onSelect(item)"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div
          v-show="errorInfo.isShow"
          absolute top-50px
          b="rd-6px 1px color-#cf222e opacity-50"
          color="#cf222e"
          w-full
          mb-10px text-center p-y-8px
        >
          {{ errorInfo.message }}
        </div>
        <div
          v-if="commitInfo.isShow"
          w-full absolute top-50px
          cursor-pointer hover:shadow-md
          flex="~ col wrap" gap-y-3px
          b="rd-6px 1px color-#d0d7de"
          p-y-8px p-x-16px
          @click="goPage"
        >
          <div color="#24292f" dark:color="white" font-600>
            {{ commitInfo.message }}
          </div>
          <div text-12px flex="~ wrap" items-center gap-5px>
            <img w-20px h-20px b-rd="50%" :src="commitInfo.avatarUrl" alt="user">
            <div font-600>
              {{ commitInfo.author }}
            </div>
            <div color="#24292f" dark:color="white">
              committed on {{ commitInfo.date }}
            </div>
          </div>
        </div>
      </div>
      <button
        shadow-md b="rd-6px 1px solid color-#1b1f24 opacity-15" color="#ffffff" bg="#218bff" hover:bg="#2e67d3"
        relative px-20px @click="onSearch"
      >
        Search
      </button>
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
