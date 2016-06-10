---
title: Unit Testing React & Redux Codebase
tags: test react redux
multi_part: true
---

This series aims to be a very comprehensive guide through testing a React and Redux codebase. In React you can cover a lot with just [unit tests] because the code is mostly [universal].

## Why Test?

Frontend testing is hard. I had an on-and-off relationship with it, each time my test ended up outdated and eventually I stopped writing them. But then my current project happened, where manually trying out each scenario was next to impossible.

I realize that writing tests for most units in your codebase might seem very time-consuming. If you've never done it before, I suggest testing from inside-out: find the part of your application which you absolutely hate manually testing and spend your extra time on writing tests just for that. It might be contagious and encourage you to start testing many other parts of your applications, but it might not, and that's okay. But the confidence that this part of your app is stable will definitely feel good :wink:

This concept is applicable to development in general, it's much easier to develop something from inside-out than outside-in. Testing really simple units which can hardly fail is not very exciting and could easily be misinterpreted as a waste of time, but you can quickly see the value when you solve the most frustrating problem. You'll also notice that testing forces you to write better code, because it requires a very systematic way of thinking about your code.

Enough chit-chat, let's dive in!

## Parts

This series consists of three parts:

{% include post_parts.html post=page %}

[unit tests]: http://codeutopia.net/blog/2015/04/11/what-are-unit-testing-integration-testing-and-functional-testing/
[universal]: https://medium.com/@mjackson/universal-javascript-4761051b7ae9#.y5w9g8pwa
