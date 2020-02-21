import superagent from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';

fetch("/src/words/a.json")
    .then(response => response.json())
    .then(json => console.log(json));
