export interface Repository {
  owner: {
    avatarUrl: string
    login: string
  }
  name: string
  url: string
  createdAt: string
  description: string
}

export interface Commit {
  author: {
    avatarUrl: string
    name: string
  }
  committedDate: string
  message: string
  oid: string
}

export interface Refs {
  defaultRef: string
  refs: string[]
}
