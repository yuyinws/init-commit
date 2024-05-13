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
  commit: {
    author: {
      avatarUrl: string
      name: string
    }
    committedDate: string
    changedFilesIfAvailable: number
    abbreviatedOid: string
    additions: number
    message: string
    oid: string
  }
  branchs: Refs
}

export interface Refs {
  defaultRef: string
  refs: string[]
}
