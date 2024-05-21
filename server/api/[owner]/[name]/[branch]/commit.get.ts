import { initalCommitQuery, totalCommitQuery } from '~/server/gql'
import type { Commit, Refs, Response } from '~/types'

export default defineCachedEventHandler(async (event): Promise<Response<Commit>> => {
  try {
    const { owner, name, branch } = getRouterParams(event)

    const branchsResponse = await $fetch<Response<Refs>>(`/api/${owner}/${name}/refs`)

    const defaultBranch = branchsResponse.data!.defaultRef

    const _branch = branch === '_' ? defaultBranch : decodeURIComponent(branch)

    const config = useRuntimeConfig()

    const totalCommitResponse = await $fetch<any>('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.github.token}`,
      },
      body: JSON.stringify({
        query: totalCommitQuery,
        variables: {
          name,
          owner,
          ref: _branch,
        },
      }),
    })

    const totalCount = totalCommitResponse.data.repository.ref.target.history.totalCount
    const endCursor = totalCommitResponse.data.repository.ref.target.history.nodes[0].oid

    const after = totalCount === 1 ? null : `${endCursor} ${(totalCount - 2).toString()}`

    const initalCommitResponse = await $fetch<any>('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.github.token}`,
      },
      body: JSON.stringify({
        query: initalCommitQuery,
        variables: {
          name,
          owner,
          ref: _branch,
          after,
        },
      }),
    })

    return {
      state: 'ok',
      data: {
        commit: initalCommitResponse.data.repository.ref.target.history.nodes[0],
        branchs: branchsResponse.data!,
      },
    }
  }
  catch (error) {
    throw createError({ statusCode: 500, statusMessage: String(error) })
  }
}, {
  maxAge: 60 * 60 * 24,
})
