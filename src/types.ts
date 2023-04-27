export type PaginationVariables = { first: number; skip: number }

// Sourcify API types
export type UserMethod = {
  notice?: string | undefined
}

export type UserEvent = {
  notice?: string | undefined
}

export type UserError = [
  {
    notice?: string | undefined
  }
]

export type UserDoc = {
  kind: 'user'
  version?: number | undefined
  notice?: string | undefined
  methods: Record<string, UserMethod>
  events: Record<string, UserEvent>
  errors?: Record<string, UserError> | undefined
}

export type DevMethod = {
  params?: Record<string, string>
  returns?: Record<string, string>
}

export type DevError = [
  {
    params?: Record<string, string>
  }
]

export type DevDoc = {
  kind: 'dev'
  version?: number | undefined
  methods: Record<string, DevMethod>
  errors?: Record<string, DevError> | undefined
}

export type Metadata = {
  version: string
  language: string
  compiler: {
    version: string
    keccak256?: string | undefined
  }
  sources: {
    [filename: string]: {
      keccak256: string
      content?: string | undefined
      urls?: string[]
      license?: string
    }
  }
  settings: {
    remappings: string[]
    optimizer?: {
      enabled: boolean
      runs: number
    }
    compilationTarget: {
      [filename: string]: string
    }
    libraries: {
      [filename: string]: string
    }
  }
  output: {
    abi: any[]
    userdoc?: UserDoc | undefined
    devdoc?: DevDoc | undefined
  }
}

export enum SourcifySource {
  // Resolve trusted IPNS for root IPFS
  IPFS_IPNS,

  // Centralized Sourcify servers
  CENTRAL_SERVER,
}
