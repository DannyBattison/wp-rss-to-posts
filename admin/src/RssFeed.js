import React, { Component } from 'react';
import './App.css';
import { FormGroup, ControlLabel, FormControl, HelpBlock, ButtonGroup, Button } from 'react-bootstrap';

/**
 * @todo: proper styling
 */

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

class RssFeed extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changePreview = this.changePreview.bind(this);

    this.state = {
      feedName: '',
      feedUrl: '',
      feedData: null,
      selectedPreviewKey: null,
    }
  }

  componentDidUpdate(oldProps, oldState) {
    if (this.state.feedUrl !== oldState.feedUrl) {
      this.loadFeed();
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  changePreview(key) {
    this.setState({selectedPreviewKey: key});
  }

  loadFeed() {
    const feedUrl = this.state.feedUrl;

    const params = new URLSearchParams;
    params.append('feedUrl', feedUrl);

    fetch('/wp-admin/admin-ajax.php?action=rss2posts_readfeed', {
      method: 'post',
      body: params,
    })
      .then(res => res.json())
      .then(feedItems => {
        this.setState({
          feedData: feedItems,
          selectedPreviewKey: 0,
        });
      });
  }

  render() {
    const feedData = this.state.feedData;
    const preview = feedData ? feedData[this.state.selectedPreviewKey] : null;

    return (
      <div>
        <FieldGroup
          id="rssFeedName"
          name="feedName"
          type="text"
          label="Feed Name"
          onChange={ e => this.handleChange(e) }
          value={ this.state.feedName }
        />
        <FieldGroup
          id="rssFeedUrl"
          name="feedUrl"
          type="url"
          label="Feed URL"
          onChange={ e => this.handleChange(e) }
          value={ this.state.feedUrl }
        />
        {
          feedData &&
          <ButtonGroup>
            {
              feedData.map(
                (item, index) => <Button key={index} onClick={e => this.changePreview(index)}>{index + 1}</Button>
              )
            }
          </ButtonGroup>
        }
        {
          preview &&
          <div>
            <h3>Item Preview:</h3>
            <FieldGroup
              id="rssFeedPreviewTitle"
              label="Title"
              readonly={ true }
              value={ preview.title }
            />
            <FieldGroup
              id="rssFeedPreviewDate"
              label="Date"
              readonly={ true }
              value={ preview.pubDate }
            />
            <ControlLabel>Content</ControlLabel>
            <div dangerouslySetInnerHTML={{__html: preview.content}} />
            {
              preview.mediaUrls.length > 0 &&
              <div>
                <ControlLabel>Image</ControlLabel>
                <img style={{maxWidth:'400px'}} src={ preview.mediaUrls[0] } />
              </div>
            }
          </div>
        }
      </div>
    );
  }
}

export default RssFeed;