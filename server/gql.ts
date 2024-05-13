export const SearchRepositoriesQuery = `#graphql
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

export const refQuery = `#graphql
query defaultRefQuery($name:String!,$owner:String!) {
  repository(name: $name, owner: $owner) {
    refs(refPrefix: "refs/heads/",first: 100) {
      nodes {
        name
      }
    }
    defaultBranchRef {
      name
    }
  }
}
`

export const totalCommitQuery = `#graphql
query totalCommitQuery($name:String!,$owner:String!,$ref:String!) {
  repository(name: $name, owner: $owner) {
    ref(qualifiedName: $ref) {
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
`

export const initalCommitQuery = `#graphql
query initalCommitQuery($name:String!,$owner:String!,$ref:String!,$after:String) {
  repository(name: $name, owner: $owner) {
    ref(qualifiedName: $ref) {
      target {
        ... on Commit {
          history(first:1,after:$after) {
            nodes {
              message
              committedDate
              abbreviatedOid
              authoredDate
              oid
              deletions
              changedFilesIfAvailable
              additions
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
`
