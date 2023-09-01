export interface Response<T> {
  state: 'ok' | 'error'
  data?: T
  error?: string
}
