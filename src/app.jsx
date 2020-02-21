import superagent from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';

fetch("/src/words/a.json")
    .then(response => response.json())
    .then(json => console.log(json));

class Tweet extends React.Component {
  render() {
    return (
      <div>
        hello
      </div>
    )
  }
}

ReactDOM.render(
  React.createElement(Tweet, {}, null),
  document.getElementById('app')
);

document.querySelectorAll('title')[0].textContent = "IMDB Top 250";
