import { env } from 'node:process'

const searchQuery = `#graphql
query SearchRepositories($query: String!) {
  search(query: $query, type: REPOSITORY, first: 10) {
      nodes {
        ... on Repository {
          owner {
            avatarUrl
            login
          }
          name
          url
          createdAt
          description
        }
      }
  }
}
`

interface Response {
  state: 'ok' | 'error'
  data?: Repository[]
  error?: any
}

export default defineEventHandler(async (event): Promise<Response> => {
  try {
    const { query } = getQuery(event)
    if (!query) {
      return {
        state: 'ok',
        data: [],
      }
    }
    const rawResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query: searchQuery,
        variables: {
          query,
        },
      }),
    })

    const response = await rawResponse.json()

    return {
      state: 'ok',
      data: response?.data?.search?.nodes,
    }
  }
  catch (error) {
    return {
      state: 'error',
      error,
    }
  }
})
