import { env } from 'node:process'
import { defaultRefQuery, initalCommitQuery, totalCommitQuery } from '~/server/gql'
import type { Commit, Response } from '~/types'

export default defineEventHandler(async (event): Promise<Response<Commit>> => {
  try {
    const { owner, name } = await readBody(event)

    const response = await $fetch<any>('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query: defaultRefQuery,
        variables: {
          name,
          owner,
        },
      }),
    })

    const defaultRef: string = response.data.repository.defaultBranchRef.name

    if (!defaultRef)
      throw new Error('No default branch found')

    const totalCommitResponse = await $fetch<any>('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query: totalCommitQuery,
        variables: {
          name,
          owner,
          ref: defaultRef,
        },
      }),
    })

    const totalCount = totalCommitResponse.data.repository.ref.target.history.totalCount
    const endCursor = totalCommitResponse.data.repository.ref.target.history.nodes[0].oid

    const after = `${endCursor} ${(totalCount - 2).toString()}`

    const initalCommitResponse = await $fetch<any>('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query: initalCommitQuery,
        variables: {
          name,
          owner,
          ref: defaultRef,
          after,
        },
      }),
    })

    return {
      state: 'ok',
      data: initalCommitResponse.data.repository.ref.target.history.nodes[0],
    }
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return {
      state: 'error',
      error: String(error),
    }
  }
})
