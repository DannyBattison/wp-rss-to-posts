import React, { Component } from 'react';
import './App.css';
import { Tab, Row, Col, Nav, NavItem } from 'react-bootstrap';
import RssFeed from './RssFeed';

class Rss2Posts extends Component {
  render() {
    return (
      <div className="Rss2Posts">
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row className="clearfix">
            <Col sm={4} lg={2}>
              <Nav bsStyle="pills" stacked>
                <NavItem eventKey="first">Tab 1</NavItem>
                <NavItem eventKey="second">Tab 2</NavItem>
              </Nav>
            </Col>
            <Col sm={8} lg={10}>
              <Tab.Content animation>
                <Tab.Pane eventKey="first"><RssFeed/></Tab.Pane>
                <Tab.Pane eventKey="second"><RssFeed/></Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  }
}

export default Rss2Posts;
