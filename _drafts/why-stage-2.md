---
title: Why I Use the Stage 2 Preset
tags: babel react eslint
---

I noticed that [many people][0] in the React community use [Stage 0] features to get all the exprimental goodies, which is why I initially used them as well, until I learned what those stages [actually were][1]. I didn't feel comfortable using features which could disappear, so I switched to using [Stage 2] because it's stable enough and it includes a very useful feature: [object rest/spread].

[0]: https://github.com/search?q=babel-preset-stage-0&ref=opensearch&type=Code
[1]: http://www.2ality.com/2015/11/tc39-process.html#solution-the-tc39-process
[Stage 0]: http://babeljs.io/docs/plugins/preset-stage-0/
[Stage 2]: http://babeljs.io/docs/plugins/preset-stage-2/
[object rest/spread]: http://babeljs.io/docs/plugins/transform-object-rest-spread/

## But... But... Static Properties, Decorators...

No buts! Consider this React example. This is how we would write a component using experimental features:

```jsx
@connect(state => ({ foo: state.foo }))
export default class Comp extends React.Component {
  static propTypes = {
    foo: React.PropTypes.string,
  };

  static defaultProps = {
    foo: 'bar',
  };

  render() {
    return (
      <div>
        {this.props.foo}
      </div>
    );
  }
}
```

Now, this is how you would write a React component with Stage 2 features:

```jsx
class Comp extends React.Component {
  render() {
    return (
      <div>
        {this.props.foo}
      </div>
    );
  }
}

Comp.propTypes = {
  foo: React.PropTypes.string,
};

Comp.defaultProps = {
  foo: 'bar',
};

export default connect(
  state => ({ foo: state.foo })
)(Comp);
```

I don't consider this format a trade-off because it's very easy to convert this component into a stateless functional component if needed.
