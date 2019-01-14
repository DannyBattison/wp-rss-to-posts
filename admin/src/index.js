import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Rss2Posts from './Rss2Posts';

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(<Rss2Posts/>, document.getElementById('rss2posts-admin'));
});
