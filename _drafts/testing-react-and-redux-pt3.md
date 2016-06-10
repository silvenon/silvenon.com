---
title: React Components
tags: test react redux ava enzyme sinon jsdom
hidden: true
part: true
---

We reached the surface of our application! Oh, crap, it's covered with a thick fog of browser inconsistencies. Meh, that's good enough for us in this series.

Testing React components is really interesting because you can easily make isolated unit tests. Writing tests for your components will make you think systematically about them and maybe encourage refactoring and splitting into smaller components if necessary.

## Tools

Facebook's addon [Test Utilities] is recommended for testing. However, I find it painfully low-level, so I recommend using Airbnb's [Enzyme], which uses Test Utilities under the hood and provides a much richer API.

[Test Utilities]: http://facebook.github.io/react/docs/test-utils.html
[Enzyme]: http://airbnb.io/enzyme/

## Callbacks

[Sinon]: http://sinonjs.org/

## DOM

Most of the times you should use [shallow rendering], which makes tests faster, more isolated, and you don't need a DOM. In case you want to fully render a component along with child components, you could set up a DOM using [jsdom]. Because of a bug in older versions of React, you always needed to set it up, even for shallow rendering, but that has been fixed.

[shallow rendering]: http://facebook.github.io/react/docs/test-utils.html#shallow-rendering
[jsdom]: https://github.com/tmpvar/jsdom

## Conclusion

What could be the next step? Integration testing? Selenium? You decide :wink: Now go out there and publish well-tested code!
