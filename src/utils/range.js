// @flow

function range(end: number): number[] {
  const result = []
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < end; i++) {
    result.push(i)
  }
  return result
}

export default range
