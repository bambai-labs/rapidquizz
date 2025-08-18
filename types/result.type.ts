export interface Result<T> {
  data?: T
  success: boolean
  errorMessage?: string
}
