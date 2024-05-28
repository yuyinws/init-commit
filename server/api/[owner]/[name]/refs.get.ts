import { refQuery } from '~/server/gql'
import type { Refs, Response } from '~/types'

export default defineCachedEventHandler(async (event): Promise<Response<Refs>> => {
  try {
    const { name, owner } = getRouterParams(event)

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

    if (response.errors?.length > 0)
      throw new Error(response.errors[0].message)

    return {
      state: 'ok',
      data: {
        defaultRef: response.data.repository.defaultBranchRef.name,
        refs: response.data.repository.refs.nodes.map((i: any) => i.name),
      },
    }
  }
  catch (error) {
    throw createError({ statusCode: 500, statusMessage: String(error) })
  }
}, {
  maxAge: 60 * 60 * 24,
})
