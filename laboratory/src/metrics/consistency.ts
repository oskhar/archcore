export function calculateConsistencyLag(commandTimestamp: string, readModelTimestamp: string): number {
  const commandTime = new Date(commandTimestamp).getTime();
  const readModelTime = new Date(readModelTimestamp).getTime();
  return Math.max(0, readModelTime - commandTime);
}
