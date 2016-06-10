---
title: Redux Code
tags: test react redux ava nock
hidden: true
part: true
---

I find testing React and Redux code very interesting. You can cover a lot with just Node unit testing, and they are really fast. Tools and concepts that I'll show here are not really tied to a framework, so you can use the one you're comfortable in, but I'll use AVA in this post.

Redux code is composed of many small pieces, so we can test layer by layer.

## Actions

Depending on your setup, [testing action creators] could be an overkill. I generate my action creators like this:

```js
// src/actions/index.js
export function action(type, payload) {
  return typeof payload === 'undefined' ? { type } : { type, payload };
}

export function createAction(type) {
  return payload => action(type, payload);
}

export const ADD_ITEM = 'ADD_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';

export const addItem = createAction(ADD_ITEM);
export const deleteItem = createAction(DELETE_ITEM);
```

It doesn't really make sense to test each action creator because they are all created in the same way. However, I could test the _creator_ of these action creators. (I think you would have stopped reading if I said "action creators creator".)

So let's do this:

```js
// test/action.js
import test from 'ava';
import { ava } from 'actions'

test('returns payload', t => {
  t.deepEqual(
    action('FOO', 'bar'),
    { type: 'FOO', payload: 'bar' }
  );
});

test('skips payload if it\'s not defined', t => {
  t.deepEqual(
    action('FOO'),
    { type: 'FOO' }
  );
});

test('doesn\'t skip a falsy, but defined payload', t => {
  t.deepEqual(
    action('FOO', false),
    { type: 'FOO', payload: false }
  );
});
```

AVA assertions have an additional optional argument: the failing message. I don't find it particularly useful, but you might :wink:

[testing action creators]: http://redux.js.org/docs/recipes/WritingTests.html#action-creators

## Reducers

We reached our reducers. After binge-watching Dan Abramov's [new Redux tutorials], I learned that you can organize your reducers bettery by composing them out of sub-reducers using [`combineReducers`] (so far I only used it once for the root reducer).

This can be our example reducer:

```js
// src/reducers/items.js
import { ADD_ITEM, DELETE_ITEM } from '../actions';
import { combineReducers } from 'redux';

const list = (state = [], action) {
  switch (action.type) {
    case ADD_ITEM:
      return state.concat(action.payload);
    case DELETE_ITEM:
      return state.filter(item => item.id !== action.payload);
    default:
      return state;
  }
}

export default combineReducers({
  list,
});
```

In our tests we can call the reducers with the previous state and the action, then assert the expected output:

```js
// test/reducers/items.js
import test from 'ava';
import reducer from 'reducers/items';
import { ADD_ITEM, DELETE_ITEM } from 'actions';

test('adds the item', t => {
  const payload = { id: 1, foo: 'bar' };
  const state = reducer({ list: [] }, { type: ADD_ITEM, payload });
  t.deepEqual(state, { list: [payload] });
});

test('removes the item', t => {
  const list = [
    { id: 1, foo: 'bar' },
    { id: 2, foo: 'bar' },
  ];
  const state = reducer({ list }, { type: DELETE_ITEM, payload: 1 });
  t.deepEqual(state, { list: [
    { id: 2, foo: 'bar' },
  ] });
});
```

[new Redux tutorials]: https://egghead.io/courses/building-react-applications-with-idiomatic-redux
[`combineReducers`]: https://github.com/reactjs/redux/blob/ad33fa7314e5db852a306d9475be5cfe22bde180/docs/api/combineReducers.md

## Selectors

I found about selectors from three different sources:

  - Dan Abramov's [selectors tutorial]
  - an optimization library [reselect]
  - a side-effect library [redux-saga][redux-saga-selectors]

They make code easier to refactor and are testable. A selector can look like this:

```js
// src/reducers/items.js
export const getFirstItem = state => state.list[0];
```

```js
// src/reducers/index.js
import { combineReducers } from 'redux';
import items, * as fromItems from './items';

export default combineReducers({
  items,
});

export const getFirstItem = state => fromItems.getFirstItem(state.items);
```

Now we have a composed `getFirstItem` selector. We are only going to test selectors in `src/reducers/index.js` because that will imply that the lower-level selectors work as well:

```js
// test/selectors.js
import test from 'ava';
import { getFirstItem } from 'reducers';

test('getFirstItem', t => {
  const list = [
    { id: 1, foo: 'bar' },
    { id: 2, foo: 'bar' },
  ];
  t.deepEqual(getFirstItem({ items: { list } }), list[0]);
});
```

[selectors tutorial]: https://egghead.io/lessons/javascript-redux-colocating-selectors-with-reducers
[reselect]: https://github.com/reactjs/reselect
[redux-saga-selectors]: http://yelouafi.github.io/redux-saga/docs/api/index.html#selectselector-args

## API Calls

Let's build a simple API function with the following features:

  - method defaults to GET
  - sends the (optional) body, in case of a non-GET request
  - decamelizes body (`fooBar` to `foo_bar`)
  - camelizes response (`foo_bar` to `fooBar`)
  - returns a promise
  - returns an error if status code is 300 or greater

For case conversion I'll use [humps], and for promise-based requests I'll use [isomorphic-fetch], which uses GitHub's [Fetch API polyfill] on the client and [node-fetch] in Node, i.e. in our tests.

```
npm install --save humps isomorphic-fetch
```

Let's write our function, I'll comment as we go:

```js
// src/utils/call-api.js
import { camelizeKeys, decamelizeKeys } from 'humps';
import fetch from 'isomorphic-fetch';

// you can't call that an app if it doesn't have .io in the URL
export const API_URL = 'https://api.your-app.io';

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
// test/utils/call-api.js
import test from 'ava';
import callApi, { API_URL } from 'utils/call-api';
import nock from 'nock';

test('method defaults to GET', t => {
  const reply = { foo: 'bar' };
  nock(API_URL)
    .get('/foo')
    .reply(200, reply);
  return callApi('foo').then(({ response }) => {
    t.deepEqual(response, reply);
  });
});

test('sends the body', t => {
  const body = { id: 5 };
  const reply = { foo: 'bar' };
  nock(API_URL)
    .post('/foo', body)
    .reply(200, reply);
  return callApi('foo', body, 'post').then(({ response }) => {
    t.deepEqual(response, reply);
  });
});

test('decamelizes the body', t => {
  const reply = { foo: 'bar' };
  nock(API_URL)
    .post('/foo', { snake_case: 'sssss...' })
    .reply(200, reply);
  return callApi('foo', { snakeCase: 'sssss...' }).then(({ response }) => {
    t.deepEqual(response, reply);
  });
});

test('camelizes the response', t => {
  nock(API_URL)
    .get('/foo')
    .reply(200, { camel_case: 'mmmh...' });
    // https://youtu.be/Nn4vJbHOMPo
  return callApi('foo').then(({ response }) => {
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

Now that we have defined our API function, we can start adding endpoints:

```js
// src/services/api.js
import callApi from '../utils/call-api';

export const addItem = item => callApi('items', 'post', item);
export const deleteItem = id => callApi(`items/${id}`, 'delete');
```

And we can test them:

```js
import test from 'ava';
import nock from 'nock';
import { API_URL } from 'utils/call-api';
import * as api from 'services/api';

test('addItem', t => {
  const item = { id: 3, foo: 'bar' };
  const reply = { foo: 'bar' };
  nock(API_URL)
    .post('/items', item)
    .reply(200, reply);
  return api.addItem(item).then(({ response }) => {
    t.deepEqual(response, reply);
  });
});

test('deleteItem', t => {
  const reply = { foo: 'bar' };
  nock(API_URL)
    .delete('/items/3')
    .reply(200, reply);
  return api.deleteItem(3).then(({ response }) => {
    t.deepEqual(response, reply);
  });
});
```

## Side-Effects

Actions can have side-effects (besides changing the state), like an API call, a redirect, or even a dispatch of another action. In my experience handling side-effects can get out of hand very quickly, so choosing a good library is important. I highly recommend [redux-saga], which is an excellent example of using Generators. It encourages separating side-effects from action creators, which feels very natural to me, and makes testing extremely simple without any need to mock.

If you don't have experience with Generators, I highly recommend reading [this chapter][generators] of "Exploring ES6".

Let's create a side effect of the action `DELETE_ITEM`, which will make the API request `deleteItem` which we defined above:

```js
// src/sagas/index.js
import { take, fork } from 'redux-saga/effects';
import { DELETE_ITEM } from '../actions';
import * as api from '../services/api';

export function *watchDeleteItem() {
  while (true) {
    const { payload } = yield take(DELETE_ITEM);
    yield fork(api.deleteItem, payload);
  }
}

export default function *rootSaga() {
  yield [
    fork(watchDeleteItem),
  ];
}
```

The saga `watchDeleteItem` waits for the store to dispatch the `DELETE_ITEM` action, then calls the `deleteItem` API function with its payload, which is the item's ID.

Testing generators can be pretty weird if you've never done it before (the same applies to using them :grin:). Effects from redux-saga output objects when called, these objects serve as instructions to the middleware. This design is great because we can write unit tests for our saga without actually executing the API function.

Let's start, I'll comment on the way:

```js
// test/sagas/watchDeleteItem.js
import test from 'ava';
import { take, fork } from 'redux-saga/effects';
import { DELETE_ITEM } from 'actions';
import * as api from 'services/api';
import { watchDeleteItem } from 'sagas';

test('calls the API function with the payload', t => {
  // first we create the generator, nothing inside it has been executed yet
  const gen = watchDeleteItem();
  // this way we can assert that the yield block indeed has the expected value
  t.deepEqual(
    gen.next().value,
    take(DELETE_ITEM)
  );
  // now we assert that the API call has been called with action's payload
  t.deepEqual(
    // we resolve the previous yield block with an action containing the payload,
    // I omitted the action type because we are not using it in our saga
    gen.next({ payload: 3 }).value,
    fork(api.deleteItem, 3)
  );
  // we assert that the generators keeps looping, which ensures that
  // the generator receives the DELETE_ITEM action indefinitely
  t.false(gen.next().done);
});
```

[generators]: http://exploringjs.com/es6/ch_generators.html

## Conclusion

This was quite a handful if you just started testing, but take your time and start small.

Even though your Redux tests pass, it doesn't mean that your UI is working correctly. Let's move to the [last level]({{ page.url | replace: 'pt2', 'pt3' }})!
