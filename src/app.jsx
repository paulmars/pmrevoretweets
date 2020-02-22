import superagent from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';
import lodash from 'lodash';
import throttledQueue from 'throttled-queue';

let throttle = throttledQueue(2, 333)

class Tweet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tweet: {
        date: "",
        full_text: ""
      },
    };
    this.promise = null;
  }

  componentDidMount() {
    throttle(() => {
      this.promise = fetch(`/src/tweetid/${this.props.tweetid}.json`)
        .then(response => response.json())
        .then(json => {
          this.setState({tweet: json})
        })
    })
  }

  componentWillUnmount() {
    if (this.promise === null || this.promise === undefined) {
      return;
    }

    // if ((typeof this.promise) === "object") {
    //   console.log(typeof this.promise);
    //   this.promise.abort();
    // }
  }

  render() {
    const { tweetid } = this.props;
    const url = `https://twitter.com/pm/status/${tweetid}`
    return (
      <div className="offset-sm-4 col-sm-4">
        <div className="tweet">
          <a href={url}>
            {this.props.tweet}
          </a>
          <blockquote className="twitter-tweet" data-lang="en">
            <p lang="en" dir="ltr">
              {this.state.tweet.full_text}
            </p>
            <a href={url}>
              {this.state.tweet.created_at}
            </a>
          </blockquote>
        </div>
      </div>
    )
  }
}

class InputText extends React.Component {
  constructor(props) {
    super(props);

    const path = window.location.pathname;
    const l = path.slice(1, path.length);
    this.state = {
      path: l,
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { change } = this.props;
    this.setState({
      path: e.target.value,
    })
    change(e)
  }

  render() {
    const { path } = this.state;
    return (
      <input
        type="text"
        name="txt"
        value={path}
        onChange={this.handleChange}
      />
    );
  }
}

class TweetList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tweetids: [],
    }
    this.handleChange = this.handleChange.bind(this);
    this.getData = lodash.throttle(this.getData.bind(this), 1000, {leading: false, trailing: true});
  }

  componentDidMount() {
    const p = window.location.pathname;
    const l = p.slice(1, p.length);
    this.getData(l);
  }

  getData(value) {
    const url = `/src/words/${value}.json`;
    if (value === "") {
      return
    }
    fetch(url).then(response => response.json()).then(json => {
      this.setState({
        tweetids: json,
      })
    });
  }

  handleChange(e) {
    const v = e.target.value;
    window.history.pushState(v, v, `/${v.toLowerCase()}`);
    this.getData(v);
  }

  render() {
    const tweets = this.state.tweetids.map(id => <Tweet key={id} tweetid={id} />)
    return (
      <div>
        <InputText change={this.handleChange} />
        {tweets}
      </div>
    );
  }
}


ReactDOM.render(
  React.createElement(TweetList, {}, null),
  document.getElementById('app')
);

document.querySelectorAll('title')[0].textContent = "Twitter";
