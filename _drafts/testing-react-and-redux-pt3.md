---
title: React Components
tags: test react redux ava enzyme sinon jsdom
hidden: true
part: true
---

We reached the surface of our application! Oh, crap, it's covered with a thick fog of browser inconsistencies. Meh, that's good enough for us in this series.

Testing React components is really interesting because you can easily make isolated unit tests. Writing tests for your components will make you think systematically about them and maybe encourage refactoring and splitting into smaller components if necessary.

Facebook's [Test Utilities] are recommended for testing. However, I find them painfully low-level, so I recommend using Airbnb's [Enzyme], which uses Test Utilities under the hood and provides a much richer API.

[Test Utilities]: http://facebook.github.io/react/docs/test-utils.html
[Enzyme]: http://airbnb.io/enzyme/

## What About the DOM?

Most of the times you should use [shallow rendering], which makes tests faster, more isolated, and you don't need a DOM. In case you want to fully render a component along with child components, you could set up a DOM using [jsdom] in `test/helpers/setup.js`:

```js
// test/helpers/setup.js
import { jsdom } from 'jsdom';

global.document = jsdom('<body></body>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;
```

[shallow rendering]: http://facebook.github.io/react/docs/test-utils.html#shallow-rendering
[jsdom]: https://github.com/tmpvar/jsdom

## What About Redux?

Some of your components will be connected to the Redux store with [`connect`]. When unit testing, you should test the raw component, not the connected one. You can achieve this easily by adding a named export to your component file, like this:

```js
export class MyComp extends Component {
  // ...
}

export default connect(
  // ...
)(MyComp)
```

Now you can access the raw component in your tests like this:

```js
import { MyComp } from 'components/MyComp';
```

Keep in mind that this wouldn't work:

```js
export class MyComp extends Component {
  // ...
}

MyComp = connect(
  // ...
)(MyComp);

export default MyComp;
```

The difference can seem subtle, but in this case you're overriding the raw component with its connected version. While it wouldn't have a negative impact on your application, it would make the raw component unreachable in your tests.

Ok, now that that's out of the way, let's start building our views.

[`connect`]: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options

## Todo Component

First we can build a component which will display a todo, with the following features:

  - it outputs the text
  - it crosses itself out when completed
  - it calls a handler when clicked

```jsx
// src/components/Test.js
import React, { PropTypes } from 'react';

const Todo = props => (
  <li
    onClick={props.onClick}
    style={% raw %}{{
      textDecoration: props.completed ? 'line-through' : 'none',
    }}{% endraw %}
  >
    {props.text}
  </li>
);

Todo.propTypes = {
  text: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Todo;
```

Let's test those features, we'll use [Sinon] for our click handler:

```jsx
// test/components/Test.spec.js
import test from 'ava';
import sinon from 'sinon';
import React from 'react';
import Todo from 'components/Todo';
import { shallow } from 'enzyme';

test('outputs the text', t => {
  const wrapper = shallow(
    // we're passing an empty function just to avoid warnings,
    // because we specified onClick as a required prop
    <Todo text="foo" completed onClick={() => {}} />
  );
  // we assert that the textual part of our component contains todo's text
  t.regex(wrapper.render().text(), /foo/);
});

test('crosses out when completed', t => {
  const wrapper = shallow(
    <Todo text="foo" completed onClick={() => {}} />
  );
  // this is possible because we're using inline styles
  t.is(wrapper.prop('style').textDecoration, 'line-through');
  // with CSS you'd be better of asserting the class name
});

test('calls onClick', t => {
  const onClick = sinon.spy(); // this spy knows everything!
  const wrapper = shallow(
    <Todo text="foo" completed onClick={onClick} />
  );
  // we simulate the click on our component,
  // i.e. the containing <li> element
  wrapper.simulate('click');
  // we assert that the click handler has been called once
  t.true(onClick.calledOnce);
});
```

[Sinon]: http://sinonjs.org/

## Todo List Component

We also need a component which will list out todos, with the following features:

  - it lists out the given array of todos
  - when a todo is clicked, it calls the `toggleTodo` action creator with its ID

```jsx
// src/components/ListTodo.js
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Todo from './Todo';
import { toggleTodo } from '../actions';
import { getTodos } from '../reducers';

export const TodoList = props => ( // notice the named export!
  <ul>
    {props.todos.map(todo => (
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => props.toggleTodo(todo.id)}
      />
    ))}
  </ul>
);

TodoList.propTypes = {
  todos: PropTypes.array.isRequired,
  toggleTodo: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  todos: getTodos(state),
});

const mapDispatchToProps = {
  toggleTodo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);
```

Now we will test those features using the named export, which isn't connected to the store:

```jsx
// test/components/TodoList.spec.js
import test from 'ava';
import sinon from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';
import { TodoList } from 'components/TodoList';

test('lists todos', t => {
  const todos = [
    { id: 1, text: 'foo', completed: false },
    { id: 2, text: 'bar', completed: false },
    { id: 3, text: 'baz', completed: false },
  ];
  const wrapper = shallow(
    <TodoList todos={todos} toggleTodo={() => {}} />
  );
  // there are million ways to test this,
  // but I think counting <Todo> components should be enough
  t.is(wrapper.find('Todo').length, 3);
});

test('toggles the todo', t => {
  const toggleTodo = sinon.spy();
  const todos = [
    { id: 1, text: 'foo', completed: false }, // only one is needed
  ];
  const wrapper = shallow(
    <TodoList todos={todos} toggleTodo={toggleTodo} />
  );
  wrapper.find('Todo').simulate('click');
  // now we want to be more specific with our spy assertion,
  // we are testing if the action is called with the expected argument
  t.true(toggleTodo.calledWith(1));
});
```

## Conclusion

You're still reading? ...I mean, yay! We reached the end of this series, hopefully now you have a better understanding of how testing a React & Redux codebase could look like.

What could be the next step? Integration testing? Selenium? You decide :wink:
