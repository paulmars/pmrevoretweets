import superagent from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';
import lodash from 'lodash';

class Tweet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tweet: {
        date: "",
        full_text: ""
      },
    };
  }

  componentDidMount() {
    fetch(`/src/tweetid/${this.props.tweetid}.json`)
    .then(response => response.json())
    .then(json => {
      this.setState({tweet: json})
    });
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
    this.handleChange = this.handleChange.bind(this);
    this.getData = lodash.throttle(this.getData.bind(this), 0, {leading: true, trailing: true});
  }

  getData(value) {
    const url = `/src/words/${value}.json`;
    console.log(url);
    fetch(url).then(response => response.json()).then(json => {
      render(json);
    });
  }

  handleChange(e) {
    this.getData(e.target.value);
  }

  render() {
    const tweets = this.props.tweetids.map(id => <Tweet key={id} tweetid={id} />)
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
