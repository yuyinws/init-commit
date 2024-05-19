import { env } from 'node:process'
import { SearchRepositoriesQuery } from '~/server/gql'
import type { Repository, Response } from '~/types'

export default defineEventHandler(async (event): Promise<Response<Repository[]>> => {
  try {
    const { query } = getQuery(event)
    if (!query) {
      return {
        state: 'ok',
        data: [],
      }
    }

    const config = useRuntimeConfig()

    const response = await $fetch<any>('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.github.token}`,
      },
      body: JSON.stringify({
        query: SearchRepositoriesQuery,
        variables: {
          query,
        },
      }),
    })

    return {
      state: 'ok',
      data: response?.data?.search?.nodes,
    }
  }
  catch (error) {
    return {
      state: 'error',
      error: String(error),
    }
  }
})
