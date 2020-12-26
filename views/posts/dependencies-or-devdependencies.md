---
title: dependencies or devDependencies
description: The question of where to save a dependency is clear when building a library, but in application codebases it's usually just a convention.
category: DEV
published: 2017-08-20
---

How should we save Node modules in our application?

Let's say that we're building a single-page web application. (The framework doesn't matter.) Usually the first thing we do is install a bunch of Node modules and save them to our `package.json` either as `dependencies` or `devDependencies`. Those are not the only places where we can save dependencies, there are also `peerDependencies` and `optionalDependencies`, but since nobody will be installing our application as a package, those fields don't matter in this context.

If we were building a library to be published on npm, these decision where to save a module would be pretty straightforward:

  - `dependencies`: is it necessary for the library to work?

  - `peerDependencies`: is it necessary for the library to work, but also should people be able to control its version?

  - `devDependencies`: are we using it _only_ for developing this library (testing, checking code style etc.)?

However, we're not publishing a library, we're building a web application, so this decision isn't that simple because the consequences of saving as one or the other don't seem to exist. Nobody depends on our code because it's not a library, so nothing happens if we make a "mistake". This is why we often make up reasons for dividing our dependencies, just to get the decision out the way.

In my experience the reasoning looks like this:

  - `dependencies`: will this module be a part of our static bundle in production?

  - `devDependencies`: are we using this module for generating the bundle or testing, checking code style etc.?

Like I said, there are no significant consequences one way or the other--we can put everything in `dependencies` or everything in `devDependencies` and we'll probably be just fine. However, there is a small hidden benefit to getting this right that I will reveal to you at the end, so let's think about our division for a second... Testing, checking code style etc. is definitely `devDependencies` territory, so if we take that away, we're left with these two questions:

  1. Will this module be a part of our static bundle in production?

  2. Are we using this module for generating the bundle?

Here is the catch: _both of these questions are the same_.

Think of it like this: after we build a static bundle, we won't be needing modules React/Vue/whatever anymore (unless we have server-side rendering) because we only used them for building the bundle.

## My proposition

I propose the following way of dividing modules: use `dependencies` for all modules included in the bundle and required for building, deploying, and serving your application. Use `devDependencies` for everything else.

In development this doesn't matter because regular `npm install` installs both sets of dependencies anyway, but if `NODE_ENV` is set to `production` npm will skip `devDependencies`. We can also explicitly choose what we want to install using the `--only` option:

  - `npm install --only=prod[uction]` installs only `dependencies`
  - `npm install --only=dev[elopment]` installs only `devDependencies`

## Benefit

Let's say that we're using a continuous deployment service. If we set `NODE_ENV` to `production` and webpack is listed under `devDependencies` (like in many codebases I have seen), the build will fail because webpack won't get installed. However, if we correctly divide our dependencies, deploys will take a little less time because we are only installing the dependencies that we need.

And that is the hidden benefit.

For example, we need react for our application to work, we also need webpack for building our application, however we _don't_ need eslint because it only checks code style, nor do we need flow-bin, but we _do_ need babel-preset-flow to remove types from our code etc.

You can always test if you divided the dependencies correctly by installing them with the option `--only=prod`.

## Conclusion

Making decisions which don't seem to cause consequences are awkward. Hopefully this post helped you get a clearer picture of how to divide your Node dependencies.
