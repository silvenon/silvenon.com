---
title: Testing a React & Redux Codebase
tags: test react redux
multi_part: true
repo: testing-react-and-redux
---

This series aims to be a very comprehensive guide through testing a React and Redux codebase, where you can really cover a lot with just [unit tests] because the code is mostly [universal].

Frontend testing is hard. I had an on-and-off relationship with it, each time my test ended up outdated and eventually I stopped writing them. But then my current project happened, where manual testing was next to impossible.

## Why Test?

Writing tests for every unit in my codebase seemed very time-consuming to me at first, so I started testing from inside-out: I chose a part of my application which was breaking very often and spent my extra time on writing tests just for that. Doing that might encourage you to start testing many other parts of your application, or it might not, and that's okay. But the confidence will definitely feel good :wink:

This concept is applicable to development in general, it's much easier to develop something from inside-out than outside-in. Testing really simple units which can hardly fail is not very exciting and could easily be misinterpreted as a waste of time, but you can quickly see the value when you test the toughest parts of your application. You'll also notice that testing forces you to write better code, because it requires a very systematic way of thinking about your code.

## Our Example App

In this tutorials we'll build a very simple todo app, which will *only* be able to toggle todos' complete states. It won't be able to add new ones because nobody likes doing that :stuck_out_tongue_winking_eye:

Enough chit-chat, let's dive in! This series consists of three parts:

{% include post_parts.html post=page %}

You can find all of the code in [this repo](https://github.com/silvenon/{{ page.repo }}).

[unit tests]: http://codeutopia.net/blog/2015/04/11/what-are-unit-testing-integration-testing-and-functional-testing/
[universal]: https://medium.com/@mjackson/universal-javascript-4761051b7ae9#.y5w9g8pwa
