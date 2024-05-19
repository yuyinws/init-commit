import { env } from 'node:process'
import { initalCommitQuery, totalCommitQuery } from '~/server/gql'
import type { Commit, Refs, Response } from '~/types'

export default defineEventHandler(async (event): Promise<Response<Commit>> => {
  try {
    const { owner, name } = await readBody(event)

    if (!name || !owner)
      throw new Error('No default branch found')

    const branchsResponse = await $fetch<Response<Refs>>('/api/refs', {
      method: 'POST',
      body: {
        owner,
        name,
      },
    })

    if (branchsResponse.state !== 'ok')
      throw new Error('No branch found')

    const defaultBranch = branchsResponse.data!.defaultRef

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
          ref: defaultBranch,
        },
      }),
    })

    const totalCount = totalCommitResponse.data.repository.ref.target.history.totalCount
    const endCursor = totalCommitResponse.data.repository.ref.target.history.nodes[0].oid

    const after = `${endCursor} ${(totalCount - 2).toString()}`

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
          ref: defaultBranch,
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
    console.error(error)
    throw error
  }
})
