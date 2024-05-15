import { env } from 'node:process'
import { repoInfoQuery } from '../../gql'
import type { Response } from '~/types'

export default defineEventHandler(async (event): Promise<Response<{
  ownerAvatarUrl: string
}>> => {
  const { owner, name } = getQuery(event)

  const repoInfoResponse = await $fetch<any>('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query: repoInfoQuery,
      variables: {
        name,
        owner,
      },
    }),
  })

  return {
    state: 'ok',
    data: {
      ownerAvatarUrl: repoInfoResponse.data.repository.owner.avatarUrl,
    },
  }
})
