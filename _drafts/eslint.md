---
title: ESLint
tags: eslint react lint ast
---

Maintaining a consistent code style is not just an agreement whether to write semicolons or not, setting up a linter like [ESLint] will make you:

  - *faster* --- the linter will warn you that you made a mistake before you run the program and it fails with an error you might not immediately understand
  - *better* --- you'll learn **why** some rules are enforced

Requirement to write your code without semicolons is not annoying by itself, it's usually the fact that you keep forgetting to do that because nothing is forcing you. Linters are here to help, where it's not important if a rule is crazy,  it's important that everyone sticks to it. Instead of making your contributors read a style guide, make linting a part of testing so contributors won't be able to skip it.

## AVA

AVA made their own [ESLint plugin][0] which warns you about some mistakes you might be making that the library itself can't catch. This is an excellent example how extending ESLint can be great.

[0]: https://github.com/avajs/eslint-plugin-ava

## Shareable Configs

There are [tons of rules][0] to choose from and manually configuring them can initially take a lot of time and energy. I suggest simply extending [Airbnb's wonderful config][1], which includes React rules, import checks etc., and adjust rules to your liking. If you feel like it, you can even read [Airbnb's JavaScript Style Guide][2]. I don't usually read, but I found it so interesting that I read the whole thing.

[0]: http://eslint.org/docs/rules/
[1]: https://www.npmjs.com/package/eslint-config-airbnb
[2]: https://github.com/airbnb/javascript

## Integrations

I strongly recommend installing an ESLint [plugin][0] in your editor, it will improve the speed of catching errors because you would be catching errors as you type, instead of being welcomed by 50 errors when you run the lint command.

[0]: http://eslint.org/docs/user-guide/integrations#editors

## Experimental Features

ESLint doesn't support experimental features out of the box, except the highly requested object rest/spread feature. You could plug in [babel-eslint], but you probably don't need it, as the beginning of the readme suggests.

[babel-eslint]: https://github.com/babel/babel-eslint

## Custom Rules

Maybe you're in a large team and ESLint and its plugins simply don't have a rule you'd like to enforce. You can [write your own][0]! If you've never worked with an [AST][astexplorer] before, it can be quite a learning curve, but this skill will be really come in handy for using some other tools as well, like [JSCodeShift].

[0]: http://eslint.org/docs/developer-guide/working-with-rules
[astexplorer]: http://astexplorer.net
[JSCodeShift]: https://github.com/facebook/jscodeshift
