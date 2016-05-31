---
title: Testing React Code
tags: test ava
---

To me testing React code is pretty interesting. You can cover a lot with just Node unit testing, which is really fast.

I started with Jest, because Facebook built it for React. It was too much for me and it felt unnecessary to be locked down to a framework like that. Then I found out you can use [Mocha], as an assertion and spying library I used [expect]. I was more comfortable with it, it had a nicer output and felt less intrusive.

This was ok for a while, but then I found [AVA], which just knocked my socks off. The readme was just hypnotizing, I couldn't stop reading. Because AVA was partially replacing what I was using expect for, I switched to [Sinon] for spies because it worked nicer with AVA.

Now, what about React? There are handy [Test Utilities] for that, but I find them painfully low-level. I recommend using [Enzyme] by Airbnb, which uses Test Utilities under the hood. It has a nicer API and you can get things done much more easily.

[expect]: https://github.com/mjackson/expect
[Mocha]: http://mochajs.org/
[AVA]: https://github.com/avajs/ava
[Sinon]: http://sinonjs.org/
[Test Utilities]: http://facebook.github.io/react/docs/test-utils.html
[Enzyme]: http://airbnb.io/enzyme/

## DOM

Most of the times you should use [shallow rendering], which makes tests faster, more isolated, and you don't need a DOM. In case you want to fully render a component along with child components, you could set up a DOM using [jsdom]. Because of a bug in older versions of React, you always needed to set it up, even for shallow rendering, but that has been fixed.

[shallow rendering]: http://facebook.github.io/react/docs/test-utils.html#shallow-rendering
[jsdom]: https://github.com/tmpvar/jsdom
