// @noflow
export function getFullTitle(edge) {
  const { isSeries, seriesTitle } = edge.node.fields
  const { title } = edge.node.exports.meta
  return isSeries && seriesTitle != null ? `${seriesTitle}: ${title}` : title
}

export function getSeries(edge, seriesMdx) {
  const { isSeries, seriesId, seriesTitle } = edge.node.fields
  if (!isSeries || seriesId == null || seriesTitle == null) return null
  const series = seriesMdx.group.find((group) => group.fieldValue === seriesId)
  if (series == null) return null
  const seriesEdges = [...series.edges] // duplicating because .sort() mutates
  return {
    title: seriesTitle,
    parts: seriesEdges
      .sort(
        (edgeA, edgeB) =>
          edgeA.node.exports.meta.seriesPart -
          edgeB.node.exports.meta.seriesPart,
      )
      .map((edge) => ({
        title: edge.node.exports.meta.title,
        path: edge.node.fields.path,
      })),
  }
}
