import superagent from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';
import lodash from 'lodash';
import throttledQueue from 'throttled-queue';

let throttle = throttledQueue(2, 333)

class Tweet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.promise = null;
    this.bump = this.bump.bind(this);
  }

  componentDidMount() {
    throttle(() => {
      this.promise = fetch(`/src/tweetid/${this.props.tweet["id"]}.json`)
        .then(response => response.json())
        .then(json => {
          this.setState({tweet: json})
          this.bump();
        })
    })
  }

  componentWillUnmount() {
    if (this.promise === null || this.promise === undefined) {
      return;
    }
  }

  bump() {
    const { tweetid } = this.props;
    setTimeout(() => {
      twttr.widgets.load(
        document.getElementById(`tweet-${tweetid}`)
      );
    }, 100)
  }

  render() {
    const { tweet } = this.props;
    const tweetid = tweet["id"];
    const url = `https://twitter.com/pm/status/${tweet["id"]}`
    return (
      <div id={`tweet-${tweetid}`}>
        <div className="tweet">
          <blockquote className="twitter-tweet" data-lang="en">
            <p lang="en" dir="ltr">
              {tweet.full_text}
            </p>
            <a href={url}>
              {tweet.created_at}
            </a>
          </blockquote>
        </div>
      </div>
    )
  }
}

class Year extends React.Component {
  render() {
    const { text, year } = this.props;
    const classes = ["btn"]
    if (text === year) {
      classes.push("btn-outline-primary")
    } else {
      classes.push("btn btn-outline-secondary")
    }
    return (
      <div className="year">
        <button type="button" className={classes} href="#" onClick={this.props.handleYear}>
          {text}
        </button>
      </div>
    )
  }
}

class Month extends React.Component {
  render() {
    const { text, month } = this.props;
    const classes = ["btn"]
    if (text === month) {
      classes.push("btn-outline-primary")
    } else {
      classes.push("btn-outline-secondary")
    }
    return (
      <div className="month">
        <button type="button" className={classes} href="#" onClick={this.props.handleMonth}>
          {text}
        </button>
      </div>
    )
  }
}

class TweetList extends React.Component {
  constructor(props) {
    super(props);
    const d = new Date();
    const years = lodash.range(d.getFullYear(), 2006);
    this.state = {
      tweets: [],
      years,
      year: 2020,
      month: 2,
    }
    this.handleChange = this.handleChange.bind(this);
    this.getData = lodash.throttle(this.getData.bind(this), 1000, {leading: false, trailing: true});
    this.handleYear = this.handleYear.bind(this);
    this.handleMonth = this.handleMonth.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  handleChange(e) {
    const v = e.target.value;
    window.history.pushState(v, v, `/${v.toLowerCase()}`);
    this.getData(v);
  }

  handleYear(year) {
    this.setState({
      year,
      month: undefined,
      tweets: [],
    })
  }

  handleMonth(month) {
    this.setState({
      month,
      tweets: [],
    }, this.getData())
  }

  getData() {
    const { year, month } = this.state;

    if ( year === undefined || month === undefined) {
      return
    }

    const mString = month.toString().padStart(2, '0');

    const url = `/src/date/${year}/${mString}.json`;
    console.log("url", url);
    fetch(url).then(response => {
      return response.json();
    }).then(tweets => {
      this.setState({ tweets })
    });
  }

  render() {
    const { year, month, day, tweets } = this.state;
    let months = lodash.reverse(lodash.range(1, 12 + 1));
    if (year == "2020") {
      months = lodash.reverse(lodash.range(1, 2 + 1));
    }
    const orderedTweets = tweets.sort((a, b) => parseInt(a["favorite_count"]) < parseInt(b["favorite_count"]))
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-1">
            <h1>Years</h1>
            {this.state.years.map(y => <Year key={`year${y}`} text={y} year={year} handleYear={() => this.handleYear(y)} />)}
          </div>
          <div className="col-sm-1">
            <h1>Months</h1>
            {months.map(m => <Month key={`month${m}`} text={m} month={month} handleMonth={() => this.handleMonth(m)} />)}
          </div>
          <div className="col-sm-10">
            <h1>Tweets</h1>
            {orderedTweets.map(tweet => <Tweet key={`tweet${tweet["id"]}`} tweet={tweet} />)}
          </div>
        </div>
      </div>
    );
  }
}


ReactDOM.render(
  React.createElement(TweetList, {}, null),
  document.getElementById('app')
);

document.querySelectorAll('title')[0].textContent = "Twitter";
