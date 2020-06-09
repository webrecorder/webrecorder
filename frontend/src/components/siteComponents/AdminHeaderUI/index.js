import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import { truncWord } from 'config';
import { getCollectionLink, truncate } from 'helpers/utils';

import { CollectionDropdown } from 'containers';

import './style.scss';


class AdminHeaderUI extends PureComponent {
  static propTypes = {
    collection: PropTypes.object,
    history: PropTypes.object,
    isAnon: PropTypes.bool,
    managing: PropTypes.bool
  };

  goToManager = () => {
    const { collection, history } = this.props;
    history.push(getCollectionLink(collection, true));
  }

  goToCollection = (id) => {
    const { collection, history } = this.props;
    history.push(`/${collection.get('owner')}/${id}/manage`);
  }

  render() {
    const { collection, isAnon, managing } = this.props;
    if (managing) {
      if (isAnon) {
        return null;
      }

      return (
        <React.Fragment>
          <div className="managing-collection d-none d-lg-block">
            Collection Manager:
          </div>
          <div className="d-none d-sm-block">
            <CollectionDropdown
              label={false}
              canCreateCollection={false}
              fromCollection={collection.get('id')}
              setCollectionCallback={this.goToCollection} />
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Button variant="dark" onClick={this.goToManager}>
          Collection Manager
        </Button>
        <span className="active-collection" title={collection.get('title')}>{truncate(collection.get('title'), 10, truncWord)}</span>
        {
          collection.get('public') &&
            <span className="visibility-badge">PUBLIC</span>
        }
      </React.Fragment>
    );
  }
}


export default AdminHeaderUI;
