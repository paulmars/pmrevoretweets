import superagent from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';


class Tweet extends React.Component {
  render() {
    const { tweetid } = this.props;
    const url = `https://twitter.com/pm/status/${tweetid}`
    return (
      <div className="tweet">
        <a href={url}>
          {this.props.tweet}
        </a>
        <blockquote className="twitter-tweet" data-lang="en">
          <p lang="en" dir="ltr"></p>
          <a href={url}>
            date
          </a>
        </blockquote>
      </div>
    )
  }
}

class TweetList extends React.Component {
  render() {
    const tweets = this.props.tweetids.map(id => <Tweet key={id} tweetid={id} />)

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
        React.createElement(TweetList, {tweetids: json}, null),
        document.getElementById('app')
      );
    });

document.querySelectorAll('title')[0].textContent = "Twitter";
