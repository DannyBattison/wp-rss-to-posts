import React, { Component } from 'react';
import './App.css';
import { Tab, Row, Col, Nav, NavItem, Button } from 'react-bootstrap';
import RssFeed from './RssFeed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faSave } from '@fortawesome/free-solid-svg-icons'

class Rss2Posts extends Component {
  constructor(props) {
    super(props);

    this.removeFeed = this.removeFeed.bind(this);
    this.addFeed = this.addFeed.bind(this);
    this.updateFeed = this.updateFeed.bind(this);
    this.saveData = this.saveData.bind(this);

    this.state = {
      rssFeeds: JSON.parse(props.rssFeeds),
    };
  }

  removeFeed() {

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
        <Tab.Container id="left-tabs-example" defaultActiveKey={rssFeeds.length > 0 ? rssFeeds[0].key : 0}>
          <Row className="clearfix">
            <Col sm={4} lg={2}>
              <Nav bsStyle="pills" stacked>
                {
                  rssFeeds.map(feed =>
                    <NavItem eventKey={feed.key}>
                      <Row className="clearfix">
                        <Col sm={9}>
                          <span class="btn">{feed.feedName ? feed.feedName : 'New Feed'}</span>
                        </Col>
                        <Col sm={3}>
                          <Button onClick={this.removeFeed}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </Col>
                      </Row>
                    </NavItem>
                  )
                }
                <Row className="clearfix">
                  <Col sm={6} className="text-left">
                    <Button onClick={this.addFeed}>
                      <FontAwesomeIcon icon={faPlus} /> Add Feed
                    </Button>
                  </Col>
                  <Col sm={6} className="text-right">
                    <Button onClick={this.saveData} className={"btn btn-primary"}>
                      <FontAwesomeIcon icon={faSave} /> Save Feeds
                    </Button>
                  </Col>
                </Row>
              </Nav>
            </Col>
            <Col sm={8} lg={10}>
              <Tab.Content animation>
                {
                  rssFeeds.map((feed) =>
                    <Tab.Pane eventKey={feed.key}>
                      <RssFeed key={feed.key} feed={feed} onChange={this.updateFeed}/>
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
