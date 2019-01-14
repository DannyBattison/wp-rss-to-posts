import React, { Component } from 'react';
import './App.css';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

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
  render() {
    return (
      <div>
        <FieldGroup
        id="rssFeedName"
        type="text"
        label="Feed Name"
        />
        <FieldGroup
        id="rssFeedUrl"
        type="url"
        label="Feed URL"
        />
      </div>
    );
  }
}

export default RssFeed;
