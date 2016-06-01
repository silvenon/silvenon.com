---
title: ESLint ft. Daft Punk
tags: eslint react lint ast
excerpt: Setting up ESLint will make things harder, better, faster, stronger.
---

Setting up [ESLint] will make things:

[ESLint]: http://eslint.org/

## Harder :notes:

It takes some getting used to, configuring, checking up rules online etc. Because of that I strongly recommend installing an ESLint [plugin][0] for your editor, it will improve the speed of catching errors because you would be catching errors as you type, instead of being welcomed by 50 errors when you run the lint command :sweat:

ESLint doesn't support experimental features out of the box, except the highly requested object rest/spread feature. You could plug in [babel-eslint], but you probably don't need it, as the beginning of the readme suggests.

[0]: http://eslint.org/docs/user-guide/integrations#editors
[babel-eslint]: https://github.com/babel/babel-eslint

## Better :microphone:

You'll become a better developer, because you'll learn **why** some rules are enforced. Fortunately, ESLint and many of its plugins are very well documented, so you can learn a lot there.

For example, if you're a React developer, you might be using `bind` and arrow functions in your `render` method, but this is bad for performance because it creates a new function on each render, as described in the [jsx-no-bind] rule of [eslint-plugin-react].

[jsx-no-bind]: https://github.com/yannickcr/eslint-plugin-react/blob/82b3aa9101aa2124b934add61734cec026b4c278/docs/rules/jsx-no-bind.md
[eslint-plugin-react]: https://github.com/yannickcr/eslint-plugin-react

## Faster :headphones:

The linter will warn you that you made a mistake before you run the program and it fails with an error you might not even understand at first. Also, it will eliminate some of the choice fatigue. Things can be written in multiple ways, so ESLint can enforce a certain style and you don't have to think. There are no crazy rules, as long as everyone sticks to them.

There are [tons of rules][0] to choose from and manually configuring them can initially take a lot of time and energy. I suggest simply extending [Airbnb's wonderful config][1], which includes React rules, import checks etc., and adjust rules to your liking. If you feel like it, you can even read [Airbnb's JavaScript Style Guide][2]. I don't usually read, but I found it so interesting that I read the whole thing.

[0]: http://eslint.org/docs/rules/
[1]: https://www.npmjs.com/package/eslint-config-airbnb
[2]: https://github.com/airbnb/javascript

## Stronger :musical_note:

Instead of making your contributors read a style guide, make linting a part of testing so your contributors won't be able to skip it. You can even [write your own rules][0]! If you've never worked with an [AST] before, it can be quite a learning curve, but this skill will be really come in handy for using some other tools as well, like [JSCodeShift].

A great example of how ESLint can be extended is the testing framework [AVA], its team made a [plugin][1] which warns you about some mistakes you might be making that the framework itself cannot catch.

[0]: http://eslint.org/docs/developer-guide/working-with-rules
[AST]: http://astexplorer.net
[JSCodeShift]: https://github.com/facebook/jscodeshift
[AVA]: https://github.com/avajs/ava
[1]: https://github.com/avajs/eslint-plugin-ava
