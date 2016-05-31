---
title: GitHub Pages file name clash
tags: short github github-pages gh-pages
redirect_from: /2014/09/github-pages-file-name-clash/
---

Let's say your user or organization name on GitHub is "easy-peasy". You want to
create a blog or something, so you create a repository named
"easy-peasy/easy-peasy.github.io", as instructed in the [GitHub Pages
documentation][github-pages]. Now you want to create a new repository,
"easy-peasy/lemon-squeezy" that you also want hosted on GitHub Pages, so you
create a `gh-pages` branch with an `index.html` in the root. What would happen
if in "easy-peasy/easy-peasy.github.io" you created a `lemon-squeezy/index.html`
file, as they would have the same URL?

## Epic drumroll

http://easy-peasy.github.io/lemon-squeezy would point to your
"easy-peasy/lemon-squeezy" repository.

[github-pages]: https://help.github.com/articles/user-organization-and-project-pages
