import React from 'react';
import ReactDOM from 'react-dom';
import Rss2Posts from './Rss2Posts';

document.addEventListener('DOMContentLoaded', function() {
  const rootElement = document.getElementById('rss2posts-admin');
  ReactDOM.render(<Rss2Posts rssFeeds={rootElement.getAttribute('data-rssFeeds')}/>, rootElement);
});
