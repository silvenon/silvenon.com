declare module 'CSSStub' {
  declare type CSSCustoms = $ReadOnly<{
    [string]: string,
  }>
  declare export default $ReadOnly<{
    customProperties: CSSCustoms,
    customMedia: CSSCustoms,
    customSelectors: CSSCustoms,
    [string]: string,
  }>
}
