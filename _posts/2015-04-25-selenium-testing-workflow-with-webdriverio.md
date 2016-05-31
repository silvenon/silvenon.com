---
title: Selenium testing workflow with WebdriverIO
tags: node test gulp webdriver selenium mocha
updated: 23.7.2015.
redirect_from: /node-selenium-testing-with-webdriverio/
---

This was my goal --- to run a single command (say `npm test`) which would install necessary Selenium drivers, fire up Selenium and HTTP servers, run integration tests (with Mocha), and finally close both servers. I didn't find a straightforward tutorial for this, so here's my own.

For this quick tutorial, I'm going to use:

  - [WebdriverIO] as Selenium bindings for Node (a better [WebDriverJS])
  - [gulp] for running tasks (if you're using [Grunt], check out [custom tasks])
  - [BrowserSync] for the HTTP server (any alternative which features a callback will do)
  - [selenium-standalone] for installing drivers and running the Selenium server
  - [Mocha] as the testing framework

Let's say we have a `test` directory which contains everything we need --- tests, fixtures and all necessary assets.

## Tasks

We'll start with a basic `gulpfile.js`:

```js
var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('serve:test', function (done) {
  browserSync({
    logLevel: 'silent',
    notify: false,
    open: false,
    port: 9000,
    server: {
      baseDir: ['test']
    },
    ui: false
  }, done);
});
```

BrowserSync has ton of awesome features, but for testing purposes we can turn off most of them. So why did I choose BrowserSync if I'm not using any of its fancy features? Out of convenience, I guess, I'm already using it for development so no need for another dependency.

Next, the `done` callback is necessary, otherwise we don't know when the server started. Our tests must **not** run before we have a server running.

Now we need to install Selenium drivers:

```js
var gulp = require('gulp');
var browserSync = require('browser-sync');
var selenium = require('selenium-standalone');

// ...

gulp.task('selenium', function (done) {
  selenium.install({
    logger: function (message) { }
  }, done);
});
```

This will install the latest [Chromedriver] by default. See the [docs][drivers] to see how to customize which drivers are installed.

After installing drivers we can start the server:

```js
var gulp = require('gulp');
var browserSync = require('browser-sync');
var selenium = require('selenium-standalone');

// ...

gulp.task('selenium', function (done) {
  selenium.install({
    logger: function (message) { }
  }, function (err) {
    if (err) return done(err);

    selenium.start(function (err, child) {
      if (err) return done(err);
      selenium.child = child;
      done();
    });
  });
});
```

- Same as with `.install()`, you can pass the map of drivers to run (as the first argument).
- We're saving the process `child` so we can `.kill()` it later. Sorry, that came out wrong.

Now we can run our integration tests, using [gulp-mocha]. The task should depend both on `serve:test` and `selenium`. The order doesn't matter, so we can run them in parallel:

```js
var gulp = require('gulp');
var browserSync = require('browser-sync');
var selenium = require('selenium-standalone');
var mocha = require('gulp-mocha');

// ...

gulp.task('integration', ['serve:test', 'selenium'], function () {
  return gulp.src('test/spec/**/*.js', {read: false})
    .pipe(mocha());
});
```

We will put our tests in the `spec` directory.

The last thing that we need to do is shut down BrowserSync and selenium-standalone when we're done running our tests:

```js
var gulp = require('gulp');
var browserSync = require('browser-sync');
var selenium = require('selenium-standalone');
var mocha = require('gulp-mocha');

// ...

gulp.task('test', ['integration'], function () {
  selenium.child.kill();
  browserSync.exit();
});
```

See what I meant by `kill()` the `child`? I bet you feel really silly now.

Here's the complete `gulpfile.js`:

```js
var gulp = require('gulp');
var browserSync = require('browser-sync');
var selenium = require('selenium-standalone');
var mocha = require('gulp-mocha');

gulp.task('serve:test', function (done) {
  browserSync({
    logLevel: 'silent',
    notify: false,
    open: false,
    port: 9000,
    server: {
      baseDir: ['test']
    },
    ui: false
  }, done);
});

gulp.task('selenium', function (done) {
  selenium.install({
    logger: function (message) { }
  }, function (err) {
    if (err) return done(err);

    selenium.start(function (err, child) {
      if (err) return done(err);
      selenium.child = child;
      done();
    });
  });
});

gulp.task('integration', ['serve:test', 'selenium'], function () {
  return gulp.src('test/spec/**/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('test', ['integration'], function () {
  selenium.child.kill();
  browserSync.exit();
});
```

Now we can run our tests with `gulp test`. Though if we add this to our `package.json`:

```js
"scripts": {
  "test": "gulp test"
},
```

we can run them with `npm test`. If we ever decide to switch to another task runner (which happens fairly often :stuck_out_tongue:), our test command will stay the same.

This command will work even if gulp isn't installed globally, because npm will first look inside your local `node_modules/.bin` before traversing up the directory tree. (Thanks, [@niksy]!)

## Fixtures

A basic fixture we'll be running our tests on:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Example</title>
</head>
<body>
  <!-- content -->
</body>
</html>
```

## Tests

Now we can start writing our example test at `test/spec/example.js`.

For assertions we can use the built-in `assert` library:

```js
var assert = require('assert');
```

Then we can initialize WebdriverIO:

```js
var assert = require('assert');
var client = require('webdriverio').remote({
  desiredCapabilities: {
    browserName: 'phantomjs'
  }
}).init();
```

Here we are using [PhantomJS], but you can just as easily use `chrome` or some other driver.

We're going to run our tests on `index.html`, so let's navigate there:

```js
var assert = require('assert');
var client = require('webdriverio').remote({
  desiredCapabilities: {
    browserName: 'phantomjs'
  }
}).init();

describe('example', function () {
  before(function (done) {
    client.url('http://localhost:9000/index.html', done);
  });

  after(function (done) {
    client.end(done);
  });
});
```

At the end of our suite we are closing the browser. Let's write our first test:

```js
var assert = require('assert');
var client = require('webdriverio').remote({
  desiredCapabilities: {
    browserName: 'phantomjs'
  }
}).init();

describe('example', function () {
  before(function (done) {
    client.url('http://localhost:9000/index.html', done);
  });

  it('tests a feature', function (done) {
    client
      .getTitle(function (err, title) {
        assert.equal(title, 'Example');
      })
      .call(done);
  });

  after(function (done) {
    client.end(done);
  });
});
```

This tests if the page title is equal to `"Example"`.

At the end of each test you should call `.call(done)`, which signifies that the test is over.

## Travis CI

I was struggling to get this to work on [Travis CI], then I came across [this][react-travis] article, which pointed out that Travis CI uses an older version of PhantomJS, not 2.x, the one I had locally. In my frontend code I was using `Function.prototype.bind`, which isn't supported by that version and was causing my tests to fail on Travis CI.

This is the `.travis.yml` configuration that worked for me:

```yaml
language: node_js

node_js:
  - node

before_install:
  - mkdir travis-phantomjs
  - wget https://s3.amazonaws.com/travis-phantomjs/phantomjs-2.0.0-ubuntu-12.04.tar.bz2 -O $PWD/travis-phantomjs/phantomjs-2.0.0-ubuntu-12.04.tar.bz2
  - tar -xvf $PWD/travis-phantomjs/phantomjs-2.0.0-ubuntu-12.04.tar.bz2 -C $PWD/travis-phantomjs
  - export PATH=$PWD/travis-phantomjs:$PATH
```

An alternative is to use a service, like [Cross Browser Testing][cbt] or [Sauce Labs], which you should for serious testing.

Also, in order to debug future errors easier, I suggest turn logging on for both the Selenium server and WebdriverIO.

```js
gulp.task('selenium', function (done) {
  selenium.install({
    logger: function (message) { }
  }, function (err) {
    if (err) return done(err);
    // this
    if (process.env.TRAVIS) {
      child.stderr.on('data', function(data){
        console.log(data.toString());
      });
    }
    selenium.start(function (err, child) {
      if (err) return done(err);
      selenium.child = child;
      done();
    });
  });
});
```

```js
var client = require('webdriverio').remote({
  // this
  logLevel: process.env.TRAVIS ? 'command' : 'silent',
  desiredCapabilities: {
    browserName: 'phantomjs'
  }
}).init();
```

It will produce a lot of output, but you'll only really have to look at it when the tests fail, which is when you will need it anyway.

## Other Goodies

- If you want to do some regression testing, check out [WebdriverCSS], a plugin for WebdriverIO inspired by [PhantomCSS].
- WebdriverIO also integrates with services like [SauceLabs], [BrowserStack] and [TestingBot].

## Conclusion

It's all about callbacks, baby.

## Credits

Thanks to [@christian-bromann], the maintainer of WebdriverIO, for reviewing this tutorial.

[webdriverio]:         http://webdriver.io/
[webdrivercss]:        http://webdriver.io/guide/plugins/webdrivercss.html
[webdriverjs]:         https://code.google.com/p/selenium/wiki/WebDriverJs
[phantomjs]:           http://phantomjs.org/
[phantomcss]:          https://github.com/Huddle/PhantomCSS
[gulp]:                http://gulpjs.com/
[grunt]:               http://gruntjs.com/
[browsersync]:         http://www.browsersync.io/
[selenium-standalone]: https://github.com/vvo/selenium-standalone
[chromedriver]:        https://code.google.com/p/selenium/wiki/ChromeDriver
[drivers]:             https://github.com/vvo/selenium-standalone#example
[mocha]:               http://mochajs.org/
[gulp-mocha]:          https://github.com/sindresorhus/gulp-mocha
[custom tasks]:        http://gruntjs.com/creating-tasks#custom-tasks
[saucelabs]:           https://github.com/webdriverio/webdriverio/blob/492c5ee7e5c5a592744b3e417caff26cfbf7b9cf/examples/webdriverio.saucelabs.js
[browserstack]:        https://github.com/webdriverio/webdriverio/blob/492c5ee7e5c5a592744b3e417caff26cfbf7b9cf/examples/webdriverio.browserstack.js
[testingbot]:          https://github.com/webdriverio/webdriverio/blob/492c5ee7e5c5a592744b3e417caff26cfbf7b9cf/examples/webdriverio.testingbot.js
[travis ci]:           https://travis-ci.org/
[react-travis]:        https://mediocre.com/forum/topics/phantomjs-2-and-travis-ci-we-beat-our-heads-against-a-wall-so-you-dont-have-to
[cbt]:                 https://crossbrowsertesting.com/
[sauce labs]:          http://saucelabs.com/

[@niksy]:              https://github.com/niksy
[@christian-bromann]:  https://github.com/christian-bromann
