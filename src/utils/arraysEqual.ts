/* eslint-disable unicorn/no-for-loop */
export function arraysEqual<T>(a: readonly T[], b: readonly T[]): boolean {
  if (a === b) return true;

  if (a.length !== b.length) return false;

  const length = a.length;
  for (let index = 0; index < length; index++) {
    if (a[index] !== b[index]) return false;
  }
  return true;
}
