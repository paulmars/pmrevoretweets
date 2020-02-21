import superagent from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';


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

fetch("/src/words/mac.json")
    .then(response => response.json())
    .then(json => {
      ReactDOM.render(
        React.createElement(TweetList, {tweetids: json}, null),
        document.getElementById('app')
      );
    });

document.querySelectorAll('title')[0].textContent = "Twitter";
