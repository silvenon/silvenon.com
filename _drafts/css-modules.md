---
title: Solved By CSS Modules
tags: css css-modules react webpack
---

I tried doing [CSS in JS] once, with Radium. It was quite a journey, let me tell you about it...

What I liked:

  - I don't have to think of class names anymore, I just apply my styles directly to the element
  - it's easier to test

What I didn't like was:

  - dynamic auto-prefixing, I'm sure it's less performant than precompiled CSS
  - having to look at CSS all the time I'm developing a component, CSS is hacky and it's just clutter when I want to focus on a component's behavior
  - inability to lint
  - writing media queries, you made a typo when writing `@mdia`? tough shit, there's no syntax highlighting or linting to warn you

[extract-text-webpack-plugin]: https://github.com/webpack/extract-text-webpack-plugin
[CSS in JS]: https://speakerdeck.com/vjeux/react-css-in-js

CSS Modules saved the day for me, because the thing I hate most about CSS is thinking of class names and making sure that they don't clash. I also hate naming methodologies, I'd rather shoot myself than write a class name like `.Component--foo__bar`.

CSS Modules encapsulate class names to a file, so I can safely write really short class names like `.box` without worrying. This way I don't have to think and my CSS is much more readable. This also greatly decreases the need for nesting, which is good for performance and specificity. Nesting is what I was mostly using Sass anyway, so it gave me a great push to finally ditch it and polyfill my way around new CSS features with [cssnext].

It might not be for everyone, but to me it felt so right, finally a good solution to the problem rather than thinking of some meaningful naming methodologies. It's like grid systems---if there are so many of them, that problem isn't solved well yet.

[cssnext]: http://cssnext.io/
