import React, { Component } from 'react';
import './App.css';
import { Tab, Row, Col, Nav, NavItem, ButtonGroup, Button } from 'react-bootstrap';
import RssFeed from './RssFeed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';

class Rss2Posts extends Component {
  constructor(props) {
    super(props);

    this.removeFeed = this.removeFeed.bind(this);
    this.addFeed = this.addFeed.bind(this);
    this.updateFeed = this.updateFeed.bind(this);
    this.saveData = this.saveData.bind(this);

    const feeds = JSON.parse(props.rssFeeds);

    this.state = {
      rssFeeds: feeds,
      selectedFeed: feeds.length > 0 ? feeds[0].key : null,
    };
  }

  removeFeed() {
    const rssFeeds = this.state.rssFeeds.filter(el => el.key !== this.state.selectedFeed);
    this.state.selectedFeed = rssFeeds.length > 0 ? rssFeeds[0].key : null;

    this.setState({rssFeeds});
  }

  addFeed() {
    const rssFeeds = this.state.rssFeeds;

    let lastKey = 0;
    if (rssFeeds.length > 0) {
      lastKey = rssFeeds[rssFeeds.length - 1].key;
    }

    rssFeeds.push({
      key: lastKey + 1,
      feedName: '',
      feedUrl: '',
    });

    this.setState({rssFeeds});
  }

  updateFeed(feed) {
    const rssFeeds = this.state.rssFeeds;
    const index = rssFeeds.findIndex(el => el.key === feed.key);

    rssFeeds[index] = {
      key: feed.key,
      feedName: feed.feedName,
      feedUrl: feed.feedUrl,
    };

    this.setState({rssFeeds});
  }

  saveData() {
    fetch(
      './admin-ajax.php?action=rss2posts_saveconfig',
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.state.rssFeeds),
      }
    );
  }

  render() {
    const rssFeeds = this.state.rssFeeds;
    return (
      <div className="Rss2Posts">
        <Tab.Container
          id="left-tabs-example"
          activeKey={this.state.selectedFeed}
          onSelect={key => this.setState({selectedFeed: key})}
        >
          <Row>
            <Col sm={12} md={3}>
              <Nav bsStyle="pills" stacked>
                {
                  rssFeeds.map(feed =>
                    <NavItem eventKey={feed.key}>
                      {feed.feedName ? feed.feedName : 'New Feed'}
                    </NavItem>
                  )
                }
              </Nav>
              <div className="text-center">
                <ButtonGroup>
                  <Button onClick={this.removeFeed} className="btn btn-danger">
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Button onClick={this.addFeed}>
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                  <Button onClick={this.saveData} className="btn btn-primary">
                    <FontAwesomeIcon icon={faSave} />
                  </Button>
                </ButtonGroup>
              </div>
            </Col>
            <Col sm={12} md={9}>
              <Tab.Content animation>
                {
                  rssFeeds.map((feed) =>
                    <Tab.Pane eventKey={feed.key}>
                      <RssFeed key={feed.key} feed={feed} onChange={this.updateFeed} onDelete={this.removeFeed}/>
                    </Tab.Pane>
                  )
                }
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  }
}

export default Rss2Posts;
