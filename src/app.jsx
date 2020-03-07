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
    this.bump = this.bump.bind(this);
  }

  componentDidMount() {
    throttle(() => {
      this.promise = fetch(`/src/tweetid/${this.props.tweetid}.json`)
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

    // if ((typeof this.promise) === "object") {
    //   console.log(typeof this.promise);
    //   this.promise.abort();
    // }
  }

  bump() {
    const { tweetid } = this.props;
    setTimeout(() => {
      console.log("!");
      twttr.widgets.load(
        document.getElementById(`tweet-${tweetid}`)
      );
    }, 1000)
  }

  render() {
    const { tweetid } = this.props;
    const url = `https://twitter.com/pm/status/${tweetid}`
    return (
      <div id={`tweet-${tweetid}`} className="offset-sm-4 col-sm-4">
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

class BestTweets extends React.Component {
  render() {
    const { year, month, day } = this.props;
  }
}

class Year extends React.Component {
  render() {
    const { year } = this.props;
    return (
      <div className="year">
        <button onClick={this.props.handleYear}>
          {year}
        </button>
      </div>
    )
  }
}

class Month extends React.Component {
  render() {
    const { month } = this.props;
    return (
      <div className="month">
        <button onClick={this.props.handleMonth}>
          {month}
        </button>
      </div>
    )
  }
}

class Day extends React.Component {
  render() {
    const { day } = this.props;
    return (
      <div className="day">
        <button onClick={this.props.handleDay}>
          {day}
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
      tweetids: [],
      years,
    }
    this.handleChange = this.handleChange.bind(this);
    this.getData = lodash.throttle(this.getData.bind(this), 1000, {leading: false, trailing: true});
    this.handleYear = this.handleYear.bind(this);
    this.handleMonth = this.handleMonth.bind(this);
    this.handleDay = this.handleDay.bind(this);
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

  handleYear(year) {
    this.setState({ year })
  }

  handleMonth(month) {
    this.setState({ month })
  }

  handleDay(day) {
    this.setState({ day })
  }

  render() {
    const tweets = this.state.tweetids.map(id => <Tweet key={id} tweetid={id} />)
    const months = lodash.range(1, 12 + 1);
    const daysInMonth = new Date(2012, 2, 0).getDate();
    const days = lodash.range(1, daysInMonth + 1);

    console.log(this.state)

    const { year, month, day } = this.state;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-1">
            <h1>Years</h1>
            {this.state.years.map(y => <Year key={`year${y}`} year={y} handleYear={() => this.handleYear(y)} />)}
          </div>
          <div className="col-sm-1">
            <h1>Months</h1>
            {months.map(m => <Month key={`month${m}`} month={m} handleMonth={() => this.handleMonth(m)} />)}
          </div>
          <div className="col-sm-1">
            <h1>Days</h1>
            {days.map(d => <Day key={`day${d}`} day={d} handleDay={() => this.handleDay(d)} />)}
          </div>
          <div className="col-sm-9">
            <h1>Tweets</h1>
            <BestTweets year={year} month={month} day={day} />
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
