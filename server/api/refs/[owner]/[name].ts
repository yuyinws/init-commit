import { Octokit } from '@octokit/core'

export default defineEventHandler(async (event) => {
  try {
    const { owner, name } = event.context.params
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
    const data = await octokit.graphql(
      `
      {
        repository(name: "${name}", owner: "${owner}") {
          defaultBranchRef {
            name
          }
          refs(first: 100, refPrefix: "refs/heads/") {
            nodes {
              name
            }
          }
        }
      }
    `,
    )
    return {
      data,
    }
  }
  catch (error) {
    return {
      data: error,
    }
  }
})

