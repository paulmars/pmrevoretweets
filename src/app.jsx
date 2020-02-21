import superagent from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';

class Tweet extends React.Component {
  render() {
    const { tweetid } = this.props.tweet;
    const url = `https://twitter.com/pm/status/${tweetid}`
    return (
      <div className="tweet">
        <a href={url}>
          {this.props.tweet.tweetid}
        </a>
      </div>
    )
  }
}

class TweetList extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {

    const tweets = this.props.tweets.map(tweet => <Tweet tweet={tweet} />)

    return (
      <div>
        {tweets}
      </div>
    )
  }
}

fetch("/src/words/square.json")
    .then(response => response.json())
    .then(json => {
      ReactDOM.render(
        React.createElement(TweetList, {tweets: json}, null),
        document.getElementById('app')
      );
    });

document.querySelectorAll('title')[0].textContent = "Twitter";
