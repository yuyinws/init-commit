import { env } from 'node:process'
import { refQuery } from '~/server/gql'
import type { Refs, Response } from '~/types'

export default defineEventHandler(async (event): Promise<Response<Refs>> => {
  try {
    const { name, owner } = await readBody(event)
    if (!name || !owner)
      throw new Error('Missing parameters')

    const config = useRuntimeConfig()

    const response = await $fetch<any>('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.github.token}`,
      },
      body: JSON.stringify({
        query: refQuery,
        variables: {
          name,
          owner,
        },
      }),
    })

    return {
      state: 'ok',
      data: {
        defaultRef: response.data.repository.defaultBranchRef.name,
        refs: response.data.repository.refs.nodes.map((i: any) => i.name),
      },
    }
  }
  catch (error) {
    return {
      state: 'error',
      error: String(error),
    }
  }
})
