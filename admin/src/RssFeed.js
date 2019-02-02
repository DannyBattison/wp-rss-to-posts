import React, { Component } from 'react';
import './App.css';
import { FormGroup, ControlLabel, FormControl, HelpBlock, ButtonGroup, Button } from 'react-bootstrap';

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

    this.abortController = new AbortController();

    this.handleChange = this.handleChange.bind(this);
    this.changePreview = this.changePreview.bind(this);

    this.state = {
      key: props.feed.key,
      feedName: props.feed.feedName,
      feedUrl: props.feed.feedUrl,
      feedData: null,
      selectedPreviewKey: null,
    }
  }

  componentDidMount() {
    this.loadFeed();
  }

  componentDidUpdate(oldProps, oldState) {
    if (this.state.feedUrl !== oldState.feedUrl) {
      this.loadFeed();
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    }, () => {
      this.props.onChange(this.state);
    });
  };

  changePreview(key) {
    this.setState({selectedPreviewKey: key});
  }

  loadFeed() {
    try {
      this.setState({
        feedData: null,
        selectedPreviewKey: null,
      });

      const url = new URL(this.state.feedUrl);

      const params = new URLSearchParams;
      params.append('feedUrl', url.href);

      this.abortController.abort();
      this.abortController = new AbortController();
      fetch('/wp-admin/admin-ajax.php?action=rss2posts_readfeed', {
        method: 'post',
        body: params,
        signal: this.abortController.signal,
      })
      .then(res => res.json())
      .then(feedItems => {
        this.setState({
          feedData: feedItems,
          selectedPreviewKey: 0,
        });
      })
      .catch(err => {});
    } catch (e) {
      return false;
    }

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
                <div><img style={{maxWidth:'400px'}} src={ preview.mediaUrls[0] } /></div>
              </div>
            }
          </div>
        }
        {
          !preview &&
          <div>A preview of your feed will appear here</div>
        }
      </div>
    );
  }
}

export default RssFeed;
