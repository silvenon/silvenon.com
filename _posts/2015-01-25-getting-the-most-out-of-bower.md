---
title: Getting the most out of Bower
tags: bower wiredep gulp grunt
redirect_from: /2015/01/getting-the-most-out-of-bower/
---

[Bower] is great. I needed a package manager like that. But by itself it's not extremely useful because after installing a component you still have to manually link it. This is tedious, especially when there are a lot of assets per component. Wouldn't it be nice if you could just run `bower install --save <component>` and have everything else just happen?

## Example

For example, in order to install Bootstrap, you would first run:

```bash
$ bower install --save bootstrap
```

then you'd need to link it up in your `index.html`:

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Fun with Bower</title>
  <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
</head>
<body>
  <h1>Fun with Bower</h1>
  <p>Having some fun with Bower.</p>
  <script src="bower_components/jquery/dist/jquery.js"></script>
  <script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
</body>
</html>
```

(jQuery was automatically installed as Bootstrap's dependency.)

Doing this for every component is boring and even a bit error-prone, as you have to be careful to order the dependencies in the correct way. You are a smart person and this is insulting for your intellect, so let's automate this.

## Automatization

Most Bower components have, or should have, a proper [`bower.json`][bowerjson] file, which has a `main` property listing all assets needed to use that component. [Wiredep] is a tool that reads the `main` property from all dependencies and can output those files in any way we want, which is in this case linking them up in our `index.html`.

There are a couple of ways to use wiredep, as listed in the [docs][integration]. We could use [gulp], [grunt] or something else, but I'll keep it simple by using wiredep's own CLI, so you can just install it globally:

```bash
$ npm install --global wiredep
```

Before using it, you should insert comment blocks, which will tell wiredep where it should output links. The syntax for a wiredep block is really simple:

```html
<!-- bower:<extension> -->
<!-- endbower -->
```

Links to assets with that extension will be injected between those two comments, and any content that was previously inside that block will get replaced.

In our `index.html` we can insert blocks for CSS and JS:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Fun with Bower</title>
  <!-- bower:css -->
  <!-- endbower -->
</head>
<body>
  <h1>Fun with Bower</h1>
  <p>Having some fun with Bower.</p>
  <!-- bower:js -->
  <!-- endbower -->
</body>
</html>
```

Other file types are supported too. E.g. a Sass comment block could be included in your `main.scss` file:

```scss
// bower:scss
// endbower
```

And all `.scss` dependencies would be `@import`ed here.

Now install a dependency, e.g. `bower install --save bootstrap`, and run:

```bash
$ wiredep --src index.html
```

See the magic happen in your `index.html`, your wiredep blocks should now contain links to Bootstrap's assets:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Fun with Bower</title>
  <!-- bower:css -->
  <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
  <!-- endbower -->
</head>
<body>
  <h1>Fun with Bower</h1>
  <p>Having some fun with Bower.</p>
  <!-- bower:js -->
  <script src="bower_components/jquery/dist/jquery.js"></script>
  <script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
  <!-- endbower -->
</body>
</html>
```

## Bower's Hooks

Bower >= 1.3.1 has [hooks] that we can use to automatically run wiredep each time we install a component. First, update Bower to get the latest version:

```
$ npm install --global bower
```

Then create a `.bowerrc` file in your project with the following content:

```js
{
  "scripts": {
    "postinstall": "wiredep -s index.html"
  }
}
```

Now try my favorite mother-of-all-examples, `bower install --save isotope`, and see your `bower:js` block get automatically updated. :sunglasses:

**Note**: you may have noticed that this will trigger wiredep only when a component is installed. It would be nice if the links get removed when we uninstall a component, but Bower is currently [missing][postuninstall] the `postuninstall` hook.

## Customization

The CLI has additional features, like excluding unwanted components, but it doesn't offer much flexibility. I was only using it for the sake of simplicity. When used via gulp or grunt you can customize it by modifying output links, adding callbacks, defining your own extensions etc.

## Caveats

It would be nice if all Bower components had a (correct) `main` property in their `bower.json`, but many of them don't, so wiredep doesn't know which assets to link. Fortunately, you can simply [override][override] properties from other components in your `bower.json`.

Also, this technique obviously doesn't work for binary assets, so you will have to do some extra work in those cases ([main-bower-files] can help). Sometimes the solution can be as simple as copying those files over to your project, but sometimes you'll have to do some replacing :confused:

[bower]: http://bower.io
[gulp]: https://github.com/gulpjs/gulp
[grunt]: https://github.com/gruntjs/grunt
[bowerjson]: http://bower.io/docs/creating-packages/#bowerjson
[wiredep]: https://github.com/taptapship/wiredep
[integration]: https://github.com/taptapship/wiredep#build-chain-integration
[hooks]: http://bower.io/docs/config/#hooks
[postuninstall]: https://github.com/bower/bower/issues/1451
[override]: https://github.com/taptapship/wiredep#bower-overrides
[main-bower-files]: https://github.com/ck86/main-bower-files
