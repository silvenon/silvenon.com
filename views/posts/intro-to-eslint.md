---
title: Intro to ESLint (ft. Daft Punk)
description: How ESLint can improve the quality of your project and even teach you JavaScript.
category: DEV
published: 2016-06-01
tweet: https://twitter.com/silvenon/status/737979934648508416
---

If you've never tried [ESLint](http://eslint.org/), I strongly recommend it. Setting it up will make things:

## Harder 🎶

It takes some getting used to. Configuring countless rules, checking them up online, accidentally pushing code with linting errors... but you'll get there.

One gotcha is that ESLint doesn't support [experimental ECMAScript features][babel-experimental] out of the box, except for the highly requested object rest/spread feature. If you want experimental features, you could plug in the [babel-eslint][babel-eslint] parser, but you should avoid using those features in production anyway, because they might not end up in the spec.

## Better 🎤

You'll become a better developer because you'll learn **why** some rules are enforced, and you'll quickly learn to follow them. ESLint and many of its plugins are very well documented, so you can learn a lot there.

For example, if you're a React developer, you might be tempted to use bind and arrow functions in your component's render method, but this hurts performance because it creates new functions on each render, as described in the [jsx-no-bind][jsx-no-bind] rule of eslint-plugin-react.

## Faster 🎧

Before you even run your script, the linter can warn you if you made a silly mistake. For example, if you mess up an import/require statement, [eslint-plugin-import][eslint-plugin-import] can warn you about this ahead of time.

Using a linter also eliminates some of the choice fatigue. Things can be written in multiple ways, and often one choice is not particularly better than the other. ESLint can enforce a certain style so you don't have to waste time trying to decide. Remember, there are no crazy rules, what's important is that everyone sticks to them.

To be even faster, you should install an ESLint [plugin for your editor][eslint-editor-plugins], it will improve the speed of catching errors because you'll see warnings as you type, instead of being welcomed by 50 errors when you finally run the lint command.

Finally, there are [tons of rules][eslint-rules] to choose from and manually configuring each one would take lots of time and energy. I suggest simply extending an existing shareable configuration package, like the wonderful [eslint-config-airbnb][eslint-config-airbnb], which includes React rules, import checks etc. and adjust rules to your liking. If you feel like it, you can even read [Airbnb's JavaScript Style Guide][airbnb-javascript]. I don't usually read, but I found it so interesting that I read the whole thing.

## Stronger 🎵

Instead of making your project's contributors read a style guide (let's be real, who remembers to read `CONTRIBUTING.md`), make linting a part of testing so your contributors won't be able to skip it.

If you'd like to enforce a rule which ESLint or its plugins don't offer yet, you can [write your own][authoring-rules]! If you've never worked with an AST before, it can be quite a learning curve, but this skill will be really come in handy for using some other tools as well, like [JSCodeShift][jscodeshift]. I suggest reading the documentation of [ast-types][ast-types] a few times, along with playing with the [AST explorer][ast-explorer], then try contributing to an existing ESLint plugin.

A great example of extending ESLint is [eslint-plugin-ava][eslint-plugin-ava]. The team behind the awesome test runner [AVA][ava] made this plugin to warn you about mistakes you might be making, which the framework itself cannot catch.

[babel-experimental]: https://babeljs.io/docs/plugins/#experimental
[babel-eslint]: https://github.com/babel/babel-eslint
[jsx-no-bind]: https://github.com/yannickcr/eslint-plugin-react/blob/82b3aa9101aa2124b934add61734cec026b4c278/docs/rules/jsx-no-bind.md
[eslint-plugin-import]: https://github.com/benmosher/eslint-plugin-import
[eslint-editor-plugins]: http://eslint.org/docs/user-guide/integrations#editors
[eslint-rules]: http://eslint.org/docs/rules/
[eslint-config-airbnb]: https://www.npmjs.com/package/eslint-config-airbnb
[airbnb-javascript]: https://github.com/airbnb/javascript
[authoring-rules]: http://eslint.org/docs/developer-guide/working-with-rules
[jscodeshift]: https://github.com/facebook/jscodeshift
[ast-types]: https://github.com/benjamn/ast-types
[ast-explorer]: http://astexplorer.net/
[eslint-plugin-ava]: https://github.com/avajs/eslint-plugin-ava
[ava]: https://github.com/avajs/ava
