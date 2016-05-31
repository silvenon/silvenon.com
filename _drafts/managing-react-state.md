---
title: Managing React State
tags: react redux saga generators
---

React's built-in state and context features can only get you so far. When building anything substantial, you'll get tangled up very quickly, so you need some kind of a library. I haven't really tried anything other than [Redux], but since it's so popular (I don't remember when I have seen so many stars on GitHub :star:), it's a good choice.

[Redux]: https://github.com/reactjs/redux

## Side-Effects

You thought Redux will be enough? This is frontend, nothing is enough. Side-effects are reactions to dispatched actions. Common examples are API calls, redirects, or even dispatching another action. I have struggled with this and found a solution which I'm pretty happy with at the moment---[redux-saga]. The learning curve here could be [generators], which take some getting used to, but this is a really smart usage of them. Sagas are nice to manage because they are completely separate from actions and they are easy to test.

[redux-saga]: http://yelouafi.github.io/redux-saga/
[generators]: https://davidwalsh.name/es6-generators
