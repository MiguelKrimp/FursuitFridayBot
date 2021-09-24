export function getMaxResults(param: string): number {
  let maxResults = 1;
  if (+param) {
    maxResults = +param;
    if (maxResults > 10) {
      maxResults = 10;
    }
  }
  return maxResults;
}
