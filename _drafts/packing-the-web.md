---
title: Packing the Web
subtitle: The Ultimate Guide to Managing and Consuming Packages on the Web
tags: package npm node browserify webpack bower jspm component
---

This post aims to help everyone to get up an running with JavaScript modules using their favorite toolchain. Modules are not a matter of preference anymore, they're a part of the [ES2015 spec][0]. Luckily, we have so many great tools at our disposal.

## Why Do We Hate Globals?

### Pollution

### Manually Ordering `<script>`s

When our workflow has no idea what depends on what, it's up to us to manually order our `<script>` tags. Have you ever worked on a web application like this? It's a nightmare, and you **will** make mistakes.

When we set up an implicit dependency tree, all of this is taken care of automatically.

### Code Linting

  1. Every time you add a library which exposes a new global, you have to manually add that global to the list of predefined globals in your linter's configuration.

  2. You have to make sure vendor files are ignored by the linter. Having a linter go through a vendor directory is pretty scary shit.

## Common Goal

There are many module formats, like AMD, UMD etc. Forget about those for now. This is how modules will be used in the future:

```js
// https://github.com/sindresorhus/superb
import superb from 'superb';

console.log('Buy our ' + superb() + ' product!');
// Buy our bedazzling product!
```

This should be the authoring experience of dealing with modules, our tools will do the rest.

Let's see how we can make this work using [Babel][1] and module loaders/bundlers.

[0]: http://www.ecma-international.org/ecma-262/6.0/#sec-modules
[1]: https://babeljs.io/

## Some Arguments Against Dependency Packages

### You Might End Up With 4 Versions of jQuery

If the authors of the libraries set the dependencies correctly, you won't. If a plugin depends on jQuery `>=1` and another one depends on `^2.1`, the latter version will be used for both plugins.

The rule is always the same: if somebody screws up, you'll have trouble.

### Large File Size

Make sure you're comparing file sizes **after** compressing and gzipping. In my case the difference between compressed and uncompressed (but not gzipped) was a whooping 600 kB.

As a test, I split up [Zepto][0] into a collection of modules, here's a [demo][1]. The reason why Zepto is a particularly interesting case is because its modules are independent. Unlike jQuery, you can compose your own Zepto build only out of modules you actually need. It turns out I was able to shim it without even touching the source code, so in my code I can just import modules I'm using, like this:

```js
import $ from 'zepto';
import 'zepto/ajax';

$.ajax(/* ... */);
```

My build step will compile only the modules I have imported, so that's one less thing to think about, yay!

[0]: http://zeptojs.com/
[1]: https://github.com/silvenon/zepto-module-demo

## Module Formats

### CommonJS

### AMD

### UMD

### ES2015

## Package Managers

### [npm][0]

Advantages:

  - as a front-end developer, you're probably already using npm, so not having to introduce an additional package manager is nice

[0]: https://www.npmjs.com/
[1]: https://github.com/npm/npm/releases

### [bower][0]

[0]: http://bower.io/

### [component][0]

[0]: http://component.github.io/
[1]: https://github.com/component

### [jspm][0]

[0]: http://jspm.io/

## [browserify][0]

I believe browserify is the easiest to pick up, that's why I love it. It has a strong community and all common problems with it are either in the handbook or on Stack Overflow.

### Shimming

What is more, you can patch most libraries with [browserify-shim][2]. It may be a bit harder to master at first, but believe me, it's worth it. [This][3] example of shimming multiple dependencies is the most comprehensive and really worth studying. Once you understand that, you'll have mastered browserify-shim.

[0]: http://browserify.org/
[1]: https://github.com/substack/browserify-handbook
[2]: https://github.com/thlorenz/browserify-shim
[3]: https://github.com/thlorenz/browserify-shim#multi-shim-example-including-dependencies

## [webpack][0]

Webpack has the advantage of not dealing only with JavaScript, but with other assets as well, which makes it very powerful. Using it I managed to completely replace gulp with a much smaller configuration. Another advantage is hot reloading, which allows you to e.g. make live updates to your React application, without having to refresh and replicate the state every time you change something.

The only downside of webpack is that it has a rather steep learning curve. It took me three attempts before finally making the switch, just because the configuration was so overwhelming to me or something. I think the documentation deserves some :heart:

### Shimming

[0]: http://webpack.github.io/

## atomify

## [wiredep][0]

### Why is it no Good?

We bring all the injected dependencies into version control, but it's much cleaner if this is going on behind the curtains and that we commit only explicitly required dependencies.

### Shimming

If a component doesn't have the `main` field defined in their `bower.json`.

[0]: https://github.com/taptapship/wiredep
[1]: https://github.com/ck86/main-bower-files

## [RequireJS][0]

[0]: http://requirejs.org/

## [SystemJS][0]

[0]: https://github.com/systemjs/systemjs

## Exporting Modules With Babel

It's best to use Babel for exporting, because you can configure whether you want your module to be CommonJS, AMD, UMD etc. So converting your library into a module cannot be simpler, afterwards all you have to do is publish it.

## Feedback

I would really appreciate as much feedback on this as possible, share links, opinions, I'm listening and updating. It's important for everyone to understand why writing your code as packages is useful, so everybody can start doing it. Yes, I'm looking at you,

  - [Bootstrap][0], and
  - [Zepto][1].

[0]: https://github.com/twbs/bootstrap/pull/16534
[1]: https://github.com/madrobby/zepto/search?utf8=%E2%9C%93&q=commonjs&type=Issues
