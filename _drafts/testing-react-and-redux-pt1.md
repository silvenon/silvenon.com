---
title: Testing Framework
tags: test ava babel
hidden: true
part: true
---

I started out with [Jest], then [Mocha], but when I found [AVA] it just knocked my socks off. The readme was hypnotizing, I couldn't stop reading.

Some of the killer features are:

  - [enhanced assertion messages] --- find out why your assertion failed from an ASCII diagram instead of reading boring text
  - the test name is generated from the file path + test name, so I can just separate tests in files and write short test names like `returns expected output`
  - [todos] --- tests are the best place to write tasks
  - [failing tests] --- if you have a known bug, but don't have time to fix it, you can write a failing test which won't break CI
  - [asserting errors] --- if an error is passed to `.ifError`, the assertion will fail with that error nicely printed

They even built an [ESLint plugin], so you can catch errors earlier and keep your tests consistent. Read more about why using ESLint is smart in [my earlier post][Intro to ESLint].

[AVA]: https://github.com/avajs/ava
[Jest]: https://facebook.github.io/jest/
[Mocha]: http://mochajs.org/
[enhanced assertion messages]: https://github.com/avajs/ava/tree/402a7d5978a18bb04c22ee40579b089ee5f6234a#enhanced-assertion-messages
[todos]: https://github.com/avajs/ava/tree/402a7d5978a18bb04c22ee40579b089ee5f6234a#test-placeholders-todo
[failing tests]: https://github.com/avajs/ava/tree/402a7d5978a18bb04c22ee40579b089ee5f6234a#failing-tests
[asserting errors]: https://github.com/avajs/ava/tree/402a7d5978a18bb04c22ee40579b089ee5f6234a#iferrorerror-message
[ESLint plugin]: https://github.com/avajs/eslint-plugin-ava
[Intro to ESLint]: http://silvenon.com/intro-to-eslint/

But you don't have to use AVA, you can map these concepts to your framework of choice.

## Configuration

Setting AVA up is a [breeze][ava-config]. This is the final configuration:

```js
"ava": {
  "babel": "inherit",
  "require": [
    "babel-register",
    "ignore-styles",
    "./test/helpers/setup.js"
  ]
},
```

Let me explain this line by line:

[ava-config]: https://github.com/avajs/ava/tree/402a7d5978a18bb04c22ee40579b089ee5f6234a#configuration

### `"babel": "inherit"`

AVA has a [default Babel configuration][ava-defaults], which is fine in most cases, but if you want to write some JSX, you'll also need at least the [React preset]. Maybe you're also using [object rest spread] and who knows what else, so it's best to tell AVA to simply use our project's Babel configuration instead of duplicating it.

[ava-defaults]: https://github.com/avajs/ava/tree/402a7d5978a18bb04c22ee40579b089ee5f6234a#es2015-support
[React preset]: https://babeljs.io/docs/plugins/preset-react/
[object rest spread]: http://babeljs.io/docs/plugins/transform-object-rest-spread/

### `"require"`

[Like in Mocha][mocha-require], the following modules are required (in the specified order) before tests are run.

[mocha-require]: http://mochajs.org/#r---require-module-name

### Note on Polyfills

If you're using the [transform-runtime] in your application, you don't need to do anything extra, `inherit` will cover it. But if you're instead using [babel-polyfill], you'll probably need it in your tests as well, so you can prepend it to the `require` array.

[transform-runtime]: https://babeljs.io/docs/plugins/transform-runtime/
[babel-polyfill]: https://babeljs.io/docs/usage/polyfill/
[Promises]: https://babeljs.io/docs/learn-es2015/#promises
[Generators]: https://babeljs.io/docs/learn-es2015/#generators

### `"babel-register"`

AVA uses Babel only for your tests, not the modules you import. Your application code also needs to be parsed, so you need [babel-register]. You could import it in the `setup.js` instead, but this way `setup.js` will also be parsed.

[babel-register]: https://babeljs.io/docs/usage/require/

### `"ignore-styles"`

Most React codebases use some kind of a module bundler like [webpack], and many of them don't import only JavaScript and JSON:

```js
import '../styles/normalize.css';
import style from '../styles/MyComp.scss';
import src from '../images/photo.jpg';
```

Your tests won't have webpack's help to handle this. While you could compile your tests with Webpack before running them, or run your tests with [Karma] and [karma-webpack], I think both of these are overkills.

Instead, you can hack those imports using [ignore-styles] (the name of this module is probably slightly outdated, it ignores images as well). You can configure it if needed, but [its defaults][ignore-styles-defaults] were enough for me.

[webpack]: http://webpack.github.io/
[ignore-styles]: https://github.com/bkonkle/ignore-styles
[ignore-styles-defaults]: https://github.com/bkonkle/ignore-styles/blob/6097902f01ce4181086386c8039df55d74b829ce/lib/ignore-styles.js#L7
[Karma]: https://karma-runner.github.io/0.13/index.html
[karma-webpack]: https://github.com/webpack/karma-webpack

### `./test/helpers/setup.js`

This is a good place to make some global accommodations if needed. For example, if you're using webpack's [DefinePlugin] to inject some globals like `DEV`, you could mimic that in this file:

```js
global.DEV = false
```

Directories like `helpers` and `fixtures` are automatically ignored, AVA won't try to run files in them as tests.

[DefinePlugin]: https://webpack.github.io/docs/list-of-plugins.html#defineplugin

## Mapping the Source Directory

To make your importing life easier, you might want to map your source directory, so instead of typing:

```js
import foo from '../../src/utils/foo';
```

you can type:

```js
import foo from 'utils/foo';
```

You might already be doing similar mapping in webpack. To mimic this feature in Node you can use the [`NODE_PATH`] environment variable. Your `package.json` test script could look like this:

```js
"scripts": {
  "test": "NODE_PATH=src ava"
},
```

If you want to be a pal to your Windows colleagues (or if you're the Windows colleague), you can fix that command using [cross-env]:

```bash
npm install --save-dev cross-env
```

```js
"scripts": {
  "test": "cross-env NODE_PATH=src ava"
},
```

[`NODE_PATH`]: https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
[cross-env]: https://github.com/kentcdodds/cross-env

### Linting Import Paths

Are you *by any chance* using ESLint and extending a version of [eslint-config-airbnb] which includes [eslint-plugin-import]? Awesome! But because of the `NODE_PATH` mapping, eslint-plugin-import will treat our "shortcut paths" as invalid. Luckily, we don't have to disable it altogether, we can use [eslint-import-resolver-node]:

```bash
npm install --save-dev eslint-import-resolver-node
```

and explain our `NODE_PATH` situation by adding the following to our ESLint config:

```yaml
settings:
  import/resolver:
    node:
      moduleDirectory:
        - node_modules
        - src
```

You could also use `paths` instead of `moduleDirectory`:

```yml
settings:
  import/resolver:
    node:
      paths:
        - src
```

But I found that the former works better with my ESLint editor plugin.

[eslint-config-airbnb]: https://www.npmjs.com/package/eslint-config-airbnb
[eslint-plugin-import]: https://github.com/benmosher/eslint-plugin-import
[eslint-import-resolver-node]: https://www.npmjs.com/package/eslint-import-resolver-node

## Conclusion

I find AVA the most ambitious and advanced testing framework out there. It has excellent cohesive documentation (with [translations]!) and a really responsive team behind it.

See you in the [next part]({{ page.url | replace: 'pt1', 'pt2' }})!

[translations]: https://github.com/avajs/ava-docs
