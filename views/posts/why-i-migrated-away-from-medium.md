---
title: Why I Migrated Away from Medium
description: Missing features and odd aspects of Medium that eventually drove me away.
category: DEV
published: 2018-09-13
tweet: https://twitter.com/silvenon/status/1040220215798374400
---

I used to have my own Jekyll blog, but then I moved completely to Medium. I had my own publication there, I was even a premium member for a while. Eventually I decided to create my own blog again, much more advanced than the one I previously had, combining features I liked on Medium with the ones I missed.

## Posts and comments

On Medium you can follow people you like, that way you receive notifications when they post something new. It even automatically follows people you already follow on Twitter, which is nice. You can also comment, like, highlight text and other fun things.

But at certain point it stopped being fun. On Medium, _stories_ are all the posts you've ever written, **including comments**. Yep, there's nothing distinguishing comments from blog posts as far as Medium is concerned. My stories are a flat list of carefully worded blog posts that I've been working on for days and comments I wrote in 10 seconds.

This decision was probably meant to encourage writing more thoughtful and constructive comments, which is just my guess because there's no official explanation, but instead it discourages me from writing comments at all. And I'm not the only one:

<div class="flex justify-center">
  <blockquote class="twitter-tweet"><p lang="en" dir="ltr">It&#39;s really confusing that <a href="https://twitter.com/Medium?ref_src=twsrc%5Etfw">@Medium</a> comments are also stories. They end up in my list of stories with long-ass titles, I&#39;m not sure what&#39;s the idea behind that. Should I think of a custom title for every comment? Or should I comment only when I have something smart to say?</p>&mdash; Matija Marohnić (@silvenon) <a href="https://twitter.com/silvenon/status/936649962460532737?ref_src=twsrc%5Etfw">December 1, 2017</a></blockquote>
</div>

## Code blocks

I generally like the writing experience on Medium. It's very minimalistic and the typography is beautiful. But I'm a developer, I want to write code. There are multiple ways to do this, you can just open a code block, but there won't be any syntax highlighting. Either for the time being or it will never ever happen, nobody knows, Medium people don't like talking with the public. Look at how bland this is:

```
function boooooring() {
  // is this supposed to be a comment?
  // I can't tell, it looks like everything else
  const iCantEven = 'kill me'
}
```

Another solution is to embed a GitHub gist or services like CodeSandbox. I don't know about you, but to me using an `<iframe>` just to get some colors is an overkill. If GitHub is down, people won't be able to read a code block that might be crucial to the blog post. Also, if I accidentally delete that gist or a sandbox at some point in the future, I ruined my blog post.

Here I can have all the colors I want without any funny business. Compare the previous code block to this one:

```js
function lookAtAllTheseColors() {
  // just look at how subtle this comment is,
  // it stays out of the way, but it's here if you need it
  const color = '#aaa';
}
```

I can actually read this. ☝️️

## Custom domain

I bought a custom domain for my publication. It was pretty pricy for just connecting a subdomain that I already owned, but I didn't want to depend on Medium's domain in case I want to switch to something else later on. That's how I managed to add redirects to map posts on Medium to posts on this site.

However, they removed that feature! People like me who got them when they were available are able to keep them, but the fact that this important feature is just gone is incredibly off-putting. 😨

## Conclusion

There are several other annoyances, but the point is that many features are either missing, broken or just weird (claps?!). I wanted far more control over writing than Medium was giving me, so here we are. Btw, this site is open source, so you can [check out][silvenon.com] this overegineered masterpiece.

Let's do this! 😎

[silvenon.com]: https://github.com/silvenon/silvenon.com
