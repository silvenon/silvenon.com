---
title: The Twilight Redux Saga
tags: react redux saga generators
---

When you're dispatching an action in Redux, sometimes you'll want a side-effect, like an API call, a redirect, or even another action. There are various ways to implement side-effects in Redux, some of which are:

  - [redux-promise]
  - [redux-thunk]
  - [custom API middleware]

[redux-promise]: https://github.com/acdlite/redux-promise
[redux-thunk]: https://github.com/gaearon/redux-thunk
[custom API middleware]: https://github.com/reactjs/redux/blob/ad33fa7314e5db852a306d9475be5cfe22bde180/examples/real-world/middleware/api.js

However, side-effects become complicated and these tools didn't cut it for me. I didn't want my actions tightly coupled with their side-effects, I wanted a successful login action to **happen to** redirect to the dashboard.

## Meet [redux-saga]

The learning curve here could be [generators], which take some getting used to, but this is a really smart usage of them. Sagas are nice to manage because they are completely separate from actions and they are easy to test.

[redux-saga]: http://yelouafi.github.io/redux-saga/
[generators]: https://davidwalsh.name/es6-generators

## [Handling Errors]

There are multiple ways to handle errors in sagas. You can rock `try...catch` blocks, but I don't recommend it, because it's easy to lose over which error you're handling.

I suggest modifying your API function to return the error. That way:

  - you have a consistent error response
  - an error in your code won't latch onto the `.catch()` part of your promise
  - your reactions to errors can be more accurate

[Handling Errors]: http://yelouafi.github.io/redux-saga/docs/basics/ErrorHandling.html

## Testing

Testing is where sagas shine, it's never been this easy to test side-effects. You don't need to mock anything, because sagas only describe commands to delegate to the store. Consider this example:

```js
import { put } from 'redux-saga/effects';
import * as actions from 'actions';

function *foo() {
  yield put(actions.fetchItems());
}

test('fetches items', t => {
  const gen = foo();
  t.deepEqual(
    gen.next().value,
    put(actions.fetchItems())
  );
  t.true(gen.next().done);
});
```

## It's Not All Sparkling Vampires

It's not perfect, sometimes tests come down to testing your code line-by-line. You need to find an arbitrary level of details, so your tests break less, but in a way that you can still test what is needed.
