import { Octokit } from '@octokit/core'

export default defineEventHandler(async (event) => {
  try {
    const { owner, name, ref } = event.context.params
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

    const data: any = await octokit.graphql(
      `
      {
        repository(name:"${name}",owner:"${owner}") {
          ref(qualifiedName:"${ref}") {
            target {
              ... on Commit {
                history(first:1) {
                  nodes {
                    oid
                  }
                  totalCount
                }
              }
            }
          }
        }
      }
      `,
    )

    const totalCount = data.repository.ref.target.history.totalCount
    const endCursor = data.repository.ref.target.history.nodes[0].oid

    const after = `${endCursor} ${(totalCount - 2).toString()}`
    const commit: any = await octokit.graphql(
      `
      {
        repository(name:"${name}",owner:"${owner}") {
          ref(qualifiedName:"${ref}") {
            target {
              ... on Commit {
                history(first:1,after:"${after}") {
                  nodes {
                    message
                    committedDate
                    authoredDate
                    oid
                    author {
                      email
                      name
                      avatarUrl
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
      data: {
        status: 1,
        results: commit.repository.ref.target.history.nodes[0],
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
