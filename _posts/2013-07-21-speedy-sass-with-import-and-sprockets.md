---
title: Speedy Sass with @import & Sprockets
updated: 17.1.2014.
tags: rails ruby css sass sprockets
redirect_from: /2013/07/speedy-sass-with-import-and-sprockets/
---

We learned that it's not possible to properly use [Sprockets][sprockets] with Sass because access to global variables, mixins and functions (let's call them **globals**) would be lost. Only `@import`ing them works. If you, like me, really love designing in the browser (maybe using [LiveReload][live-reload] or something similar), you are probably having a hard time dealing with the slow compilation time on larger projects, because it's killing your creativity. I would like to propose a way to bring Sprockets back to the game.

## Rails only

AFAIK, this tutorial is for Rails only. Maybe there are Rack applications that I'm not aware of which handle their assets in a similar way. Probably not.

## The @import way

To spice things up, we're going to use [Twitter Bootstrap][bootstrap] and [Bourbon][bourbon] in this example. Simply add them to your Gemfile:

```ruby
gem "bootstrap-sass"
gem "bourbon"
```

Your main stylesheet might look something like this:

```scss
// application.css.scss

// The configuration for Bootstrap.
@import "config/bootstrap";

// Bootstrap.
@import "twitter/bootstrap";

// Bourbon, a minimal, modern set of variables, mixins and functions. A Compass alternative.
@import "bourbon";

// Variables, mixins and functions concerning your site. The order matters, we included Bourbon and these stylesheets after Bootstrap so Bootstrap doesn't override our stuff (for example, Bourbon's "size" mixin).
@import "variables";
@import "mixins";
@import "functions";

// General styles, containing mostly element selectors.
@import "base";
@import "typography";
@import "forms";

// Individual modules, containing mostly class selectors.
@import "buttons";
@import "list-fancy";
// ...
```

From the compilation's point of view, this means that every time you change any of the imported stylesheets, other stylesheets will have to recompile too, even though they have not changed, which can several seconds, depending on the amount of styles. This is because when stylesheets are imported, they become **partials**, they aren't treated as individual stylesheets anymore. From now on, I'll use that term (*partial*) when referring to imported stylesheets.

## The Sprockets way

Sprockets do something different. They compile each stylesheet individually and only stylesheets that have changed get recompiled.

Our first attempt at implementing Sprockets into our project might look something like this:

```scss
// application.css.scss

//= require config/bootstrap
//= require twitter/bootstrap
//
//= require bourbon
//
//= require variables
//= require mixins
//= require functions
//
//= require base
//= require typography
//= require forms
//
//= require buttons
//= require list-fancy
// ...
```

This would be great! ...if it worked. Because these stylesheets are compiled individually, they don't have access to the globals and the compilation will fail.

It sucks, but it won't stop us from achieving the fast compilation we so desperately want!

When using Sprockets, we can't have globals, so we will have to import them at the top of each stylesheet:

```scss
// buttons.scss

@import "config/bootstrap";
@import "twitter/bootstrap/variables";
@import "twitter/bootstrap/mixins";
@import "bourbon";
@import "variables";
@import "mixins";
@import "functions";

button {
  include border-radius(4px);
}
```

But we don't want to import all this crap on top of a stylesheet just to create a simple border radius. We could join them all into one stylesheet and import just that stylesheet, but that wouldn't solve the main problem: the recompilation time. If we were to update any of these globals, each stylesheet would recompile which would take even longer than with the `@import` approach. It's enough to import *only* the globals we need:

```scss
// buttons.scss

@import "mixins";

button {
  include border-radius(4px);
}
```

We can now safely use Sprockets in our main stylesheet, are you ready?! Ok, let's do it!

```scss
// application.css.scss

//= require bootstrap
//
//= require base
//= require typography
//= require forms
//
//= require buttons
//= require list-fancy
// ...
```

Your recompilation time should now remind you of Speedy Gonzales.

Why? Because each stylesheet will be compiled separately, i.e. only when edited. You will especially notice the change if you're using a CSS framework like Bootstrap.

## Caveats

You won't be able to `@extend` accross stylesheets, but [SMACSS][smacss] advises against that anyway. Pretty much the only case when you (or I, let me know in the comments) would have to do that is when you want to extend a clearfix class. **Solution**: use a clearfix mixin (Bourbon and Compass have one). The difference in the amount of generated CSS will be subtle. If you don't care about legacy browsers and if there are no fancy box shadows in the container, you can use `overflow: hidden` as a clearfix.

There may be more caveats, I only recently started to use this approach. You can let me know if you find more!

## Conclusion

This solution may feel somewhat hacky at the beginning, but it's really worth it, because you can fully enjoy the awesomeness of the Asset Pipeline.

I haven't seen anyone using something like this or even talking about it. Are you using a similar approach? Is there a better way to do this? Let me know in the comments! :)

[sprockets]:            https://github.com/sstephenson/sprockets
[live-reload]:          http://livereload.com
[guard]:                https://github.com/guard/guard
[guard-sprockets]:      https://github.com/pferdefleisch/guard-sprockets
[bootstrap]:            http://getbootstrap.com/
[bootstrap-sass]:       https://github.com/twbs/bootstrap-sass
[bourbon]:              http://bourbon.io/
[smacss]:               http://smacss.com/
