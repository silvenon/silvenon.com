// flow-typed signature: 90ce2994ce48b0ed70d0243965ae35f1
// flow-typed version: 9efd05a511/fuzzaldrin-plus_v0.6.0/flow_>=v0.25.x

// @flow

declare module 'fuzzaldrin-plus' {
  declare class Query {}

  declare type Options = {|
    allowErrors?: boolean,
    usePathScoring?: boolean,
    useExtensionBonus?: boolean,
    pathSeparator?: '/' | '\\' | string,
    optCharRegEx?: RegExp,
    wrap?: {| tagOpen?: string, tagClass?: string, tagClose?: string |},
    preparedQuery?: Query,
  |};

  declare module.exports: {
    Query: Class<Query>,

    filter<T>(
      candidates: T[] | $ReadOnlyArray<T>,
      query: string,
      options?: ?{|
        ...Options,
        ...{|
          key?: string,
          maxResults?: number,
          maxInners?: number,
        |},
      |},
    ): T[],

    score(string: string, query: string, options?: ?Options): number,

    match(string: string, query: string, options?: ?Options): number[],

    wrap(string: string, query: string, options?: ?Options): string,

    prepareQuery(query: string, options?: ?Options): Query,
  };
}
