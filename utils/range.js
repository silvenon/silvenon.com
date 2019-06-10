function range(end) {
  const result = []
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < end; i++) {
    result.push(i)
  }
  return result
}

module.exports = range
