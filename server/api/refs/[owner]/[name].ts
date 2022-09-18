import { Octokit } from '@octokit/core'

export default defineEventHandler(async (event) => {
  try {
    const { owner, name } = event.context.params
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
    const data: any = await octokit.graphql(
      `
      {
        repository(name:"${name}",owner:"${owner}") {
          defaultBranchRef {
            name
          }
        }
      }
    `,
    )
    return {
      data: {
        status: 1,
        results: data.repository.defaultBranchRef.name,
      },
    }
  }
  catch (error) {
    return {
      data: {
        status: 0,
        results: error,
      },
    }
  }
})

