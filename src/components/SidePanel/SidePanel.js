import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import UserPanel from '../UserPanel/UserPanel';
import Channels from './Channels';
import DirectMessages from './DirectMessages';
import Starred from './Starred';

export default class SidePanel extends Component {
  render() {
    const { user, primaryColor } = this.props;
    return (
      <Menu
        size='large'
        inverted
        fixed='left'
        vertical
        style={{ background: primaryColor, fontSize: '1.2rem' }}
      >
        <UserPanel primaryColor={primaryColor} user={user} />
        <Starred user={user} />
        <Channels user={user} />
        <DirectMessages user={user} />
      </Menu>
    )
  }
}
