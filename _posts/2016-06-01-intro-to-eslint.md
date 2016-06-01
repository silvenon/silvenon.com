---
title: Intro to ESLint (ft. Daft Punk)
display_title: Intro to ESLint (ft.&nbsp;Daft&nbsp;Punk)
tags: eslint react lint ast
excerpt: If you've never tried ESLint, I strongly recommend it. Setting it up will make things harder, better, faster, stronger.
redirect_from: /eslint-ft-daft-punk/
---

If you've never tried [ESLint], I strongly recommend it. Setting it up will make things:

[ESLint]: http://eslint.org/

## Harder :notes:

It takes some getting used to. Configuring countless rules, checking them up online, accidentally pushing code with linting errors... but you'll get there.

One gotcha is that ESLint doesn't support [experimental ECMAScript features][0] out of the box, except for the highly requested object rest/spread feature. If you want experimental features, you could plug in the [babel-eslint] parser, but you shouldn't use them in production anyway :wink:

[0]: https://babeljs.io/docs/plugins/#experimental
[babel-eslint]: https://github.com/babel/babel-eslint

## Better :microphone:

You'll become a better developer because you'll learn **why** some rules are enforced, and you'll quickly learn to follow them. Fortunately, ESLint and many of its plugins are very well documented, so you can learn a lot there.

For example, if you're a React developer, you might be using `bind` and arrow functions in your component's `render` method, but this is bad for performance because it creates new functions on each render, as described in the [jsx-no-bind] rule of eslint-plugin-react.

[jsx-no-bind]: https://github.com/yannickcr/eslint-plugin-react/blob/82b3aa9101aa2124b934add61734cec026b4c278/docs/rules/jsx-no-bind.md

## Faster :headphones:

The linter will warn you if you make a silly mistake, before you even run your program. For example, if you mess up your `import`/`require` statement, [eslint-plugin-import] can warn you about this ahead of time.

To be even faster, you should install an ESLint [plugin for your editor][1], it will improve the speed of catching errors because you'd see warnings as you type, instead of being welcomed by 50 errors when you finally run the lint command :sweat:

Using a linter also eliminates some of the choice fatigue. Things can be written in multiple ways, and ESLint can enforce a certain style so you don't have to think. Remember, there are no crazy rules, what's important is that everyone sticks to them.

Finally, there are [tons of rules][2] to choose from and manually configuring each one would take lots of time and energy. I suggest simply extending [Airbnb's wonderful config][3], which includes React rules, import checks etc. and adjust rules to your liking. If you feel like it, you can even read [Airbnb's JavaScript Style Guide][4]. I don't usually read, but I found it so interesting that I read the whole thing.

[eslint-plugin-import]: https://github.com/benmosher/eslint-plugin-import
[1]: http://eslint.org/docs/user-guide/integrations#editors
[2]: http://eslint.org/docs/rules/
[3]: https://www.npmjs.com/package/eslint-config-airbnb
[4]: https://github.com/airbnb/javascript

## Stronger :musical_note:

Instead of making your project's contributors read a style guide (let's be real, who reads `CONTRIBUTING.md`), make linting a part of testing so your contributors won't be able to skip&nbsp;it.

If you'd like to enforce a rule which ESLint or its plugins don't offer yet, you can [write your own][5]! If you've never worked with an AST before, it can be quite a learning curve, but this skill will be really come in handy for using some other tools as well, like [JSCodeShift]. I suggest reading the documentation of [ast-types] a few times, along with playing with the [AST explorer], then try contributing to an existing ESLint plugin.

A great example of extending ESLint is [eslint-plugin-ava]. The team behind the awesome test runner [AVA] made this plugin to warn you about mistakes you might be making, which the framework itself cannot catch.

[5]: http://eslint.org/docs/developer-guide/working-with-rules
[AST explorer]: http://astexplorer.net
[JSCodeShift]: https://github.com/facebook/jscodeshift
[ast-types]: https://github.com/benjamn/ast-types
[eslint-plugin-ava]: https://github.com/avajs/eslint-plugin-ava
[AVA]: https://github.com/avajs/ava

*[AST]: Abstract Syntax Tree
