---
title: Redux Code
tags: test react redux ava nock
hidden: true
part: true
---

Redux code is composed of many small pieces, so we can test layer by layer.

## Actions

Depending on your setup, [testing action creators] could be an overkill. For example, I generate my action creators like this:

```js
// src/actions/index.js
// inspired by Flux Standard Action
export function action(type, payload) {
  if (typeof payload === 'undefined') {
    return { type };
  }
  return { type, payload };
}

function createAction(type) {
  return payload => action(type, payload);
}

export const TOGGLE_TODO = 'TOGGLE_TODO';
export const toggleTodo = createAction(TOGGLE_TODO);
```

and it doesn't really make sense to test each action creator because they are all created in the same way. However, I could test the `action` function:

```js
// test/action.spec.js
import test from 'ava';
import { action } from 'actions';

// does the result action have the given payload?
test('returns payload', t => {
  t.deepEqual(
    action('FOO', 'bar'),
    { type: 'FOO', payload: 'bar' }
  );
});

// we don't want to set an undefined payload,
// we'd rather skip it in that case
test('skips payload if it\'s not defined', t => {
  t.deepEqual(
    action('FOO'),
    { type: 'FOO' }
  );
});

// but we do want it to return other falsy values, like 0 or false
test('doesn\'t skip a falsy, but defined payload', t => {
  t.deepEqual(
    action('FOO', false),
    { type: 'FOO', payload: false }
  );
});
```

AVA assertions have an additional optional argument: the failing message. I don't find it particularly useful because the assertion error is very clear, but you might ¯ \\\_(ツ)\_/ ¯

[testing action creators]: http://redux.js.org/docs/recipes/WritingTests.html#action-creators

## Reducers

We reached our reducers, which will consist of two reducers: a single todo and a list of todos:

```js
// src/reducers/todos.js
import { TOGGLE_TODO } from '../actions';

const todo = (state, action) => {
  switch (action.type) {
    case TOGGLE_TODO:
      if (state.id !== action.payload) {
        return state;
      }
      return {
        ...state,
        completed: !state.completed,
      };
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case TOGGLE_TODO:
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

export default todos;
```

I learned that composing trick from Dan Abramov's [new Redux tutorials] :grin:

Then we can create our root reducer:

```js
// src/reducers/index.js
import { combineReducers } from 'redux';
import todos from './todos';

export default combineReducers({
  todos,
});
```

which we'll use when configuring the store. (I'll omit store configuration for brevity, but you can see it in [the repo].)

In our tests we can call the reducers with the previous state and the action (using the action creator), then assert the expected output:

```js
// test/reducers/todos.spec.js
import test from 'ava';
import reducer from 'reducers/todos';
import { toggleTodo } from 'actions';

test('toggles the todo', t => {
  const prevState = [
    { id: 1, text: 'foo', completed: false },
    { id: 2, text: 'bar', completed: false },
    { id: 3, text: 'baz', completed: false },
  ];
  const nextState = reducer(prevState, toggleTodo(2));
  t.deepEqual(nextState, [
    { id: 1, text: 'foo', completed: false },
    { id: 2, text: 'bar', completed: true }, // this one should be toggled
    { id: 3, text: 'baz', completed: false },
  ]);
});
```

You could make this test more compact using [redux-ava], which provides a convenient `reducerTest` helper:

```js
// test/reducers/todos.spec.js
import test from 'ava';
import reducer from 'reducers/todos';
import { toggleTodo } from 'actions';
import { reducerTest } from 'redux-ava';

test('toggles the todo', reducerTest(
  reducer,
  [
    { id: 1, text: 'foo', completed: false },
    { id: 2, text: 'bar', completed: false },
    { id: 3, text: 'baz', completed: false },
  ],
  toggleTodo(2),
  [
    { id: 1, text: 'foo', completed: false },
    { id: 2, text: 'bar', completed: true }, // this one should be toggled
    { id: 3, text: 'baz', completed: false },
  ]
));
```

[new Redux tutorials]: https://egghead.io/courses/building-react-applications-with-idiomatic-redux
[redux-ava]: https://github.com/sotojuan/redux-ava

## Selectors

I found about selectors from three different sources:

  - Dan Abramov's [selectors tutorial]
  - an optimization library [reselect]
  - the [`select`] effect in redux-saga

Selectors make refactoring easier, can be memoized, and are testable. They look like this:

```js
// src/reducers/index.js
// ...
export const getTodos = state => state.todos;
```

Yes, it *is* pretty silly to test this selector, but as you compose selectors it's a good idea to test the most complex ones, which will imply that the lower-level ones work as well. But let's test this one for the sake of an example:

```js
// test/selectors.spec.js
import test from 'ava';
import { getTodos } from 'reducers';

test('getTodos', t => {
  const todos = [
    { id: 1, text: 'foo', completed: true },
    { id: 2, text: 'bar', completed: false },
    { id: 3, text: 'baz', completed: true },
  ];
  // we assert that the selector returns todos from the store
  t.deepEqual(getTodos({ todos }), todos);
});
```

[selectors tutorial]: https://egghead.io/lessons/javascript-redux-colocating-selectors-with-reducers
[reselect]: https://github.com/reactjs/reselect
[`select`]: http://yelouafi.github.io/redux-saga/docs/api/index.html#selectselector-args

## API Calls

Let's build a simple API function with the following features:

  - it uses the given method, defaulting to GET
  - it sends the (optional) body, in case of a non-GET request
  - it decamelizes the body (`fooBar` to `foo_bar`)
  - it camelizes the response (`foo_bar` to `fooBar`)
  - it returns a promise
  - it returns an error if status code is 300 or greater

For case conversion I'll use [humps], and for promise-based requests I'll use [isomorphic-fetch], which uses GitHub's [Fetch API polyfill] on the client and [node-fetch] in Node:

```
npm install --save humps isomorphic-fetch
```

Let's write our function, I'll comment as we go:

```js
// src/utils/call-api.js
import { camelizeKeys, decamelizeKeys } from 'humps';
import fetch from 'isomorphic-fetch';

// you can't call yourself an app if you don't have an .io domain
export const API_URL = 'https://api.myapp.io';

export default function callApi(endpoint, method = 'get', body) {
  return fetch(`${API_URL}/${endpoint}`, { // power of template strings
    headers: { 'content-type': 'application/json' }, // I forget to add this EVERY TIME
    method, // object shorthand
    body: JSON.stringify(decamelizeKeys(body)), // this handles undefined body as well
  })
    // a clever way to bundle together both the response object and the JSON response
    .then(response => response.json().then(json => ({ json, response })))
    .then(({ json, response }) => {
      const camelizedJson = camelizeKeys(json);

      if (!response.ok) {
        return Promise.reject(camelizedJson);
      }

      return camelizedJson;
    })
    // we could also skip this step and use try...catch blocks instead,
    // but that way errors can easily bleed into wrong catch blocks
    .then(
      response => ({ response }),
      error => ({ error })
    );
}
```

Now we can start testing the features we described. Testing API calls can seem weird, but [nock] is an excellent tool for the job:

```bash
npm install --save-dev nock
```

```js
// test/utils/call-api.spec.js
import test from 'ava';
import callApi, { API_URL } from 'utils/call-api';
import nock from 'nock';

test('method defaults to GET', t => {
  const reply = { foo: 'bar' };
  // we are intercepting https://api.myapp.io/foo
  nock(API_URL)
    .get('/foo')
    .reply(200, reply);
  // AVA will know to wait for the promise if you return it,
  // alternatively you can use async/await
  return callApi('foo').then(({ response, error }) => {
    // if there is an error, this assertion will fail
    // and it will nicely print out the stack trace
    t.ifError(error);
    // we assert that the response body matches
    t.deepEqual(response, reply);
  });
});

test('sends the body', t => {
  const body = { id: 5 };
  const reply = { foo: 'bar' };
  nock(API_URL)
    .post('/foo', body) // if the request is missing this body, nock will throw
    .reply(200, reply);
  return callApi('foo', 'post', body).then(({ response, error }) => {
    t.ifError(error);
    t.deepEqual(response, reply);
  });
});

test('decamelizes the body', t => {
  const reply = { foo: 'bar' };
  nock(API_URL)
    .post('/foo', { snake_case: 'sssss...' }) // what we expect
    .reply(200, reply);
                                // what we send ↓
  return callApi('foo', 'post', { snakeCase: 'sssss...' })
    .then(({ response, error }) => {
      t.ifError(error);
      t.deepEqual(response, reply);
    });
});

test('camelizes the response', t => {
  nock(API_URL)
    .get('/foo')
    .reply(200, { camel_case: 'mmmh...' });
    // they apparently use camel sounds in Doom when demons die,
    // I can see why: https://youtu.be/Nn4vJbHOMPo
  return callApi('foo').then(({ response, error }) => {
    t.ifError(error);
    t.deepEqual(response, { camelCase: 'mmmh...' });
  });
});

// not really necessary because it's implied by previous tests
// test('returns a promise', t => {
// });

test('returns the error', t => {
  const reply = { message: 'Camels are too creepy, sorry!' };
  nock(API_URL)
    .get('/camel_sounds')
    .reply(500, reply);
  return callApi('camel_sounds').then(({ error }) => {
    t.deepEqual(error, reply);
  });
});
```

[isomorphic-fetch]: https://github.com/matthew-andrews/isomorphic-fetch
[humps]: https://github.com/domchristie/humps
[Fetch API polyfill]: https://github.com/github/fetch
[node-fetch]: https://github.com/bitinn/node-fetch
[nock]: https://github.com/node-nock/nock

### Endpoints

Now that we have defined our API function, we can add an endpoint for toggling a todo:

```js
// src/services/api.js
import callApi from '../utils/call-api';

export const toggleTodo = id => callApi(`todos/${id}/toggle`, 'post');
```

and we can test it:

```js
import test from 'ava';
import nock from 'nock';
import { API_URL } from 'utils/call-api';
import * as api from 'services/api';

test('toggleTodo', t => {
  const reply = { foo: 'bar' };
  nock(API_URL)
    .post('/todos/3/toggle')
    .reply(200, reply);
  return api.toggleTodo(3).then(({ response, error }) => {
    t.ifError(error);
    t.deepEqual(response, reply);
  });
});
```

Easy-peasy! If `toggleTodo` makes a request to any other URL (or with a different method), the test will fail.

## Side-Effects

Actions can have side-effects, like an API call, a redirect, or even a dispatch of another action. In my experience handling side-effects can get out of hand very quickly, so choosing a good library is important. I highly recommend [redux-saga] ([this reddit discussion][reddit-redux-saga] has some great points), which is an excellent example of using Generators. It encourages separating side-effects from action creators, which feels very natural to me, and makes testing extremely simple without having to mock stuff.

If you don't have experience with Generators, I highly recommend reading [this chapter][generators] of "Exploring ES6", they are quite something :grin: and take some time getting used to.

We want to make an API call after toggling a todo, i.e. we want to call `toggleTodo` as a response to the `TOGGLE_TODO` action:

```js
// src/sagas/index.js
import { take, fork } from 'redux-saga/effects';
import { TOGGLE_TODO } from '../actions';
import * as api from '../services/api';

export function *watchToggleTodo() {
  while (true) { // endless loops are perfectly normal in generators
    const { payload } = yield take(TOGGLE_TODO); // extracting the action's payload
    yield fork(api.toggleTodo, payload); // making a non-blocking API call
  }
}

export default function *rootSaga() {
  yield [
    fork(watchToggleTodo),
  ];
}
```

Again, I'm omitting adding saga middleware to the store for brevity, but you can check it out in [the repo].

The saga `watchToggleTodo` waits for the store to dispatch the `TOGGLE_TODO` action, then calls the `toggleTodo` API function with the action's payload, which is the ID of the todo.

Testing generators can be pretty weird if you've never done it before (the same applies to using them at all :grin:). The great thing about redux-saga is that its effects output objects, which serve as instructions to the middleware. This means that we can write unit tests for our saga without actually executing the API function. That's because we are testing the generators in isolation, so they never reach the middleware.

Let's start testing:

```js
// test/sagas/watchToggleTodo.spec.js
import test from 'ava';
import { take, fork } from 'redux-saga/effects';
import { TOGGLE_TODO } from 'actions';
import * as api from 'services/api';
import { watchToggleTodo } from 'sagas';

test('calls the API function with the payload', t => {
  // first we create the generator, it won't start until we call next()
  const gen = watchToggleTodo();
  // we assert that the yield block indeed has the expected value
  t.deepEqual(
    gen.next().value,
    take(TOGGLE_TODO)
  );
  t.deepEqual(
    // we resolve the previous yield block with the action
    gen.next({ type: TOGGLE_TODO, payload: 3 }).value,
    // then we assert that the API call has been called with the ID
    fork(api.toggleTodo, 3)
  );
  // finally, we assert that the generator keeps looping,
  // which ensures that the it receives TOGGLE_TODO indefinitely
  t.false(gen.next().done);
});
```

[redux-saga]: http://yelouafi.github.io/redux-saga/
[reddit-redux-saga]: https://www.reddit.com/r/reactjs/comments/4ng8rr/redux_sagas_benefits/
[generators]: http://exploringjs.com/es6/ch_generators.html

## Conclusion

This was quite a handful if you only started testing, but take your time and start small, this blog post is not going anywhere :wink:

Even though our Redux tests pass, it doesn't mean that our UI is working correctly. Let's move to the [last level]({{ page.url | replace: 'pt2', 'pt3' }})!

[the repo]: https://github.com/silvenon/testing-react-and-redux
