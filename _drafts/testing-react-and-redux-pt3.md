---
title: React Components
tags: test react redux ava enzyme sinon jsdom
hidden: true
part: true
---

We reached the surface! Oh, crap, it's covered with a thick fog of browser inconsistencies. Meh, that's good enough for us.

Testing React components is really fun because you can completely isolate them if you need to.

There are handy [Test Utilities] for that, but I find them painfully low-level. I recommend using [Enzyme] by Airbnb, which uses Test Utilities under the hood. It has a nicer API and you can get things done much more easily.

[Test Utilities]: http://facebook.github.io/react/docs/test-utils.html
[Enzyme]: http://airbnb.io/enzyme/
[Sinon]: http://sinonjs.org/

## DOM

Most of the times you should use [shallow rendering], which makes tests faster, more isolated, and you don't need a DOM. In case you want to fully render a component along with child components, you could set up a DOM using [jsdom]. Because of a bug in older versions of React, you always needed to set it up, even for shallow rendering, but that has been fixed.

[shallow rendering]: http://facebook.github.io/react/docs/test-utils.html#shallow-rendering
[jsdom]: https://github.com/tmpvar/jsdom

## Conclusion

What could be the next step? Integration testing? Selenium? You decide :wink: Now go out there and publish well-tested code!
