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
        });
    })
  }

  componentWillUnmount() {

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
  render() {
    const { change } = this.props
    return (
      <input
        type="text"
        name="txt"
        onChange={change}
      />
    );
  }
}

function render(json) {
  ReactDOM.render(
    React.createElement(TweetList, {tweetids: json}, null),
    document.getElementById('app')
  );
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

  getData(value) {
    const url = `/src/words/${value}.json`;
    fetch(url).then(response => response.json()).then(json => {
      this.setState({
        tweetids: json,
      })
    });
  }

  handleChange(e) {
    const value = e.target.value;
    window.history.pushState(value, value, `/${value.toLowerCase()}`);
    this.getData(value);
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

render([])

document.querySelectorAll('title')[0].textContent = "Twitter";
