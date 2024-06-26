import { repoInfoQuery } from '../../gql'
import type { Response } from '~/types'

export default defineEventHandler(async (event): Promise<Response<{
  ownerAvatarUrl: string
}>> => {
  try {
    const { owner, name } = getQuery(event)

    const config = useRuntimeConfig()

    const repoInfoResponse = await $fetch<any>('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.github.token}`,
      },
      body: JSON.stringify({
        query: repoInfoQuery,
        variables: {
          name,
          owner,
        },
      }),
    })

    if (repoInfoResponse.errors?.length > 0)
      throw new Error(repoInfoResponse.errors[0].message)

    return {
      state: 'ok',
      data: {
        ownerAvatarUrl: repoInfoResponse.data.repository.owner.avatarUrl,
      },
    }
  }
  catch (error) {
    throw createError({ statusCode: 500, statusMessage: String(error) })
  }
})
