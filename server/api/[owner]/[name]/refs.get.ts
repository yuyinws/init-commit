import { refQuery } from '~/server/gql'
import type { Refs, Response } from '~/types'

export default defineCachedEventHandler(async (event): Promise<Response<Refs>> => {
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

  return {
    state: 'ok',
    data: {
      defaultRef: response.data.repository.defaultBranchRef.name,
      refs: response.data.repository.refs.nodes.map((i: any) => i.name),
    },
  }
}, {
  maxAge: 60 * 60 * 24,
})
