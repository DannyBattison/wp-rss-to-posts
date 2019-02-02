import React, { Component } from 'react';
import './App.css';
import { Tab, Row, Col, Nav, NavItem, Button } from 'react-bootstrap';
import RssFeed from './RssFeed';

class Rss2Posts extends Component {
  constructor(props) {
    super(props);

    this.addFeed = this.addFeed.bind(this);
    this.updateFeed = this.updateFeed.bind(this);
    this.saveData = this.saveData.bind(this);

    this.state = {
      rssFeeds: JSON.parse(props.rssFeeds),
    };
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

  updateFeed(key, data) {
    const rssFeeds = this.state.rssFeeds;
    const index = rssFeeds.findIndex(el => el.key === key);

    rssFeeds[index] = {
      key: key,
      feedName: data.feedName,
      feedUrl: data.feedUrl,
    };
    console.log(rssFeeds);

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
    return (
      <div className="Rss2Posts">
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row className="clearfix">
            <Col sm={4} lg={2}>
              <Nav bsStyle="pills" stacked>
                {
                  this.state.rssFeeds.map((feed, key) =>
                    <NavItem eventKey={key}>{feed.feedName ? feed.feedName : 'New Feed'}</NavItem>
                  )
                }
                <Button onClick={this.addFeed}>Add Feed</Button>
                <Button onClick={this.saveData} className={"btn btn-primary"}>Save Feeds</Button>
              </Nav>
            </Col>
            <Col sm={8} lg={10}>
              <Tab.Content animation>
                {
                  this.state.rssFeeds.map((feed, key) =>
                    <Tab.Pane eventKey={key}><RssFeed key={key} feed={feed} onChange={this.updateFeed}/></Tab.Pane>
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
