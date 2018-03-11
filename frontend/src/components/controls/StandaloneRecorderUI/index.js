import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, InputGroup, FormGroup, FormControl } from 'react-bootstrap';

import config from 'config';
import { addTrailingSlash, apiFetch, fixMalformedUrls,
         remoteBrowserMod } from 'helpers/utils';

import { CollectionDropdown, ExtractWidget,
         RemoteBrowserSelect } from 'containers';

import './style.scss';


class StandaloneRecorderUI extends Component {

  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    activeCollection: PropTypes.object,
    extractable: PropTypes.object,
    selectedBrowser: PropTypes.string,
    username: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      recordingTitle: config.defaultRecordingTitle,
      url: ''
    };
  }

  handleInput = (evt) => {
    evt.preventDefault();
    this.setState({ [evt.target.name]: evt.target.value });
  }

  startRecording = (evt) => {
    evt.preventDefault();
    const { activeCollection, extractable, selectedBrowser } = this.props;
    const { recordingTitle, url } = this.state;
    //const cleanRecordingTitle = encodeURIComponent(recordingTitle.trim());

    if (!url) {
      return false;
    }

    const cleanUrl = addTrailingSlash(fixMalformedUrls(url));

    // data to create new recording
    const data = {
      url: cleanUrl,
      coll: activeCollection.id,
    };

    // add remote browser
    if (selectedBrowser) {
      data.browser = selectedBrowser;
    }

    if (extractable) {
      const mode = extractable.get('allSources') ? 'extract' : 'extract_only';
      data.url = extractable.get('targetUrl');
      data.mode = `${mode}:${extractable.get('id')}`;
      data.ts = extractable.get('timestamp');
    } else {
      data.mode = 'record';
    }

    // generate recording url
    apiFetch('/new', data, { method: 'POST' })
      .then(res => res.json())
      .then(({ url }) => this.context.router.history.push(url.replace(config.appHost, '')))
      .catch(err => console.log('error', err));
  }

  render() {
    const { activeCollection, extractable } = this.props;
    const { recordingTitle, url } = this.state;

    const isOutOfSpace = false;
    const btnClasses = classNames({
      disabled: isOutOfSpace,
    });

    return (
      <form className="start-recording-homepage" onSubmit={this.startRecording}>
        <InputGroup className="col-md-8 col-md-offset-2 containerized">

          <div className="input-group-btn rb-dropdown">
            <RemoteBrowserSelect />
          </div>

          {/* TODO: annoying discrepancy in bootstrap height.. adding fixed height here */}
          <FormControl type="text" name="url" onChange={this.handleInput} style={{ height: '33px' }} value={url} placeholder="URL to record" required disabled={isOutOfSpace} />
          <label htmlFor="url" className="control-label sr-only">Url</label>

          {
            !extractable &&
              <div className="input-group-btn record-action">
                <Button bsStyle="default" type="submit" className={btnClasses}>
                  <span className="glyphicon glyphicon-dot-lg" /> Record
                </Button>
              </div>
          }

          <ExtractWidget
            includeButton
            toCollection={activeCollection.title}
            url={url} />

        </InputGroup>
        <FormGroup className="col-md-10 col-md-offset-2 top-buffer form-inline">

          {/*
          <label htmlFor="recording-name">New Recording Name:&emsp;</label>
          <InputGroup>
            <FormControl id="recording-name" name="recordingTitle" onChange={this.handleInput} type="text" bsSize="sm" className="homepage-title" value={recordingTitle} required disabled={isOutOfSpace} />
          </InputGroup>
         */}

          <CollectionDropdown />

        </FormGroup>
      </form>
    );
  }
}

export default StandaloneRecorderUI;