export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function isBuild(): boolean {
  return process.env.npm_lifecycle_event === 'build'
}
