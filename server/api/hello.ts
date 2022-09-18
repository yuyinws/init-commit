import { Octokit } from '@octokit/core'

export default defineEventHandler(async () => {
  try {
    const octokit = new Octokit({ auth: '' })
    const { repository } = await octokit.graphql(
      `
      {
        repository(owner: "yuyinws", name: "steam-card") {
          name
          refs(first: 100, refPrefix: "refs/heads/") {
            edges {
              node {
                name
                target {
                  ... on Commit {
                    id
                    history(first: 1) {
                      totalCount
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    )
    return {
      data: repository,
    }
  }
  catch (error) {
    return {
      data: error,
    }
  }
})

