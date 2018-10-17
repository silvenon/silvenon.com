# [silvenon.com]

Medium wasn't good enough for me, so I decided to roll my own overengineered site. This readme is for the technologically curious. Do you want to know what this beast is made of?

## Gatsby

The most important technology powering this site is [Gatsby][gatsby]. I love coding in React, but I also needed this site to be static. Gatsby proved to be a perfect companion for combining these two needs. It has a great community and many plugins for popular tools.

## CSS Modules

I'm very passionate about CSS, but I was bad at controlling the cascade and errors were hard to detect. Methodologies like BEM were too much typing, CSS-in-JS solutions introduced too much overhead, so I finally decided on using CSS Modules with PostCSS. Gatsby already has support for CSS Modules and there was already a plugin for PostCSS, so it was really easy to get started. My code relies heavily on [custom properties][], which aren't supported on IE 11, but you might be able to get around it using [postcss-preset-env][].

## MDX

A big piece of this puzzle is also [MDX][mdx], which allows me to write a perfect combination of Markdown and JSX. This means that I can easily embed React components with complicated functionality, like [responsive images](#responsive-images), with minimal friction.

Thanks so much to the MDX team for MDX itself and to [ChristopherBiscardi] for building a Gatsby plugin for MDX! 😍

[ChristopherBiscardi]: ChristopherBiscardi

## Syntax highlighting

Since MDX uses rehype under the hood, it was fairly easy to implement syntax highlihgting for code blocks using [@mapbox/rehype-prism]. Then I just scrolled through available [Prism themes][prism-themes] and picked my favorite one.

## Responsive images

I'm very passionate about responsive images, and [Cloudinary][cloudinary] makes this ridiculously easy becuase I can apply image transformations just by changing the URL. This allowed me to build a React component and add responsive images to my blog posts with [5 lines of code][responsive-image].

## Intrinsic ratio

When making media like images and iframes responsive, it usually means that the height is unknown until it's loaded. This can be uncomfortable because once it loads it pushes the content, which can be very annoying.

Now, I didn't spend weeks overengineering this site just to let this fly! Fortunately there's a [CSS trick][aspect-ratio-boxes] for this, so I created system of complicated components that do a bunch of calculations in the background to get this issue out of the way, with zero cost for the user (me).

Now at any given viewport width the correct height is reserved in advance, so when images load they no longer disrupt the layout.

## Hanging punctuation

One thing I really like on Medium is hanging quotes, i. e. outdenting text that starts with a quotation mark so that the text after the quotation mark starts where it would without the quotation mark, and the quotation mark sits in the margin.

I created a React component which detects this and applies proper indentation. The amount of indentation depends on the typeface, so my implementation is currently pretty clumsy, but it looks pretty cool:

<img
  alt="example of a hanging quote"
  src="https://res.cloudinary.com/silvenon/image/upload/v1536763414/Screen_Shot_2018-09-12_at_16.42.12_wiaxmt.png"
  width="348"
  height="223"
/>

## Jest

Integrating [Jest][jest] with Gatsby wasn't very fun because Gatsby currently doesn't expose its Babel configuration, which I needed for Jest, so I had to copy Gatsby's internal Babel configuration. If Gatsby decides to modify it at some point, I won't know about it, because Gatsby's philosophy is partially to get configuration out of your way as much as possible.

But it works! I only have a few tests so far, but it's so useful to be able to test components so easily. I'm using the wonderful [react-testing-library].

## Prettier & ESLint

ESLint is amazing for warning you about potential antipatterns and common pitfalls, and Prettier is excellent for enforcing code style with its opinionated nature and simple config. Code that's not prettified is turned into ESLint errors using [eslint-plugin-prettier], then I undid ESLint rules which collide with Prettier using [eslint-config-prettier]. For the final step I set up my ESLint VS Code extension to autofix on save.

Integrating these three tools is pretty complex, isn't it? 😄

## Flow

I also integrated Flow, which is probably the biggest overkill in this project, but I want to become good at it and this is a good playground.

## lint-staged and husky

I wanted to prevent committing code with ESLint/Prettier/Flow errors. I could have set a pre-commit hook which runs ESLint and Flow, but it's time consuming to run ESLint across the entire codebase on every commit, especially if I'm just committing a Markdown file.

This is where [lint-staged] comes in, it's a tool that runs commands only on files _staged_ with git. I specified that for JS files I want to run ESLint, which means that when committing some JS files and a Markdown file lint-staged will run ESLint only on those JS files. At the moment I'm using `eslint` instead of `eslint --fix`, which simply halts committing if there's an error, because lint-staged can't handle partially staged files yet ([but there's a PR][lint-staged-partial]).

Flow doesn't need to be run on per-file basis because it has a smart server running in the background, so running it across the entire codebase usually takes a fraction of a second. ⚡️

Lastly, I wanted to add the actual pre-commit git hook that would run Flow and lint-staged. [Husky][husky] is an excellent tool for maintaining git hooks becuase it automatically installs them to my `.git` folder as soon as I run `npm install`.

## Netlify

And, finally, [Netlify][netlify] made all of the deployment and DNS stuff a breeze. I quickly set it up, told it how to build the site and configured each Medium story URL to redirect to the corresponding post URL here in about 15 minutes.

[silvenon.com]: https://silvenon.com
[gatsby]: https://next.gatsbyjs.org/
[CSS Modules]: https://github.com/css-modules/css-modules
[custom properties]: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
[postcss-preset-env]: https://preset-env.cssdb.org/
[mdx]: https://mdxjs.com/
[cloudinary]: overengineered
[@mapbox/rehype-prism]: https://github.com/mapbox/rehype-prism/blob/master/index.js
[prism-themes]: https://github.com/PrismJS/prism-themes
[responsive-image]: blob/0e68c9c6adc93842f20f51e506c3fb242324b04c/src/posts/2018-04-23_ditching-masculinity-and-femininity.mdx#L14-L18
[aspect-ratio-boxes]: https://css-tricks.com/aspect-ratio-boxes
[jest]: https://jestjs.io/
[react-testing-library]: https://github.com/kentcdodds/react-testing-library
[eslint-plugin-prettier]: https://github.com/prettier/eslint-plugin-prettier
[eslint-config-prettier]: https://github.com/prettier/eslint-plugin-prettier
[lint-staged]: https://github.com/okonet/lint-staged
[lint-staged-partial]: https://github.com/okonet/lint-staged/pull/75
[husky]: https://github.com/typicode/husky
[netlify]: https://www.netlify.com/
