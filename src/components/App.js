import React from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';

import './App.css';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';

const App = ({ user, currentChannel, isChannelPrivate, userPosts, primaryColor, secondaryColor, }) => (
  <Grid
    columns='equal'
    className='app'
    style={{ background: secondaryColor }}
  >
    <ColorPanel user={user} key={user && user.name} />
    <SidePanel
      key={user && user.uid}
      user={user}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
    />

    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages
        key={currentChannel && currentChannel.id}
        currentChannel={currentChannel}
        user={user}
        isChannelPrivate={isChannelPrivate}
      />
    </Grid.Column>

    <Grid.Column width='4'>
      <MetaPanel
        isChannelPrivate={isChannelPrivate}
        key={currentChannel && currentChannel.name}
        currentChannel={currentChannel}
        userPosts={userPosts}
      />
    </Grid.Column>
  </Grid>
)

const mapStateToProps = state => ({
  user: state.user.currentUser,
  currentChannel: state.channels.currentChannel,
  isChannelPrivate: state.channels.isChannelPrivate,
  userPosts: state.channels.userPosts,
  primaryColor: state.colors.primary,
  secondaryColor: state.colors.secondary,
})

export default connect(mapStateToProps)(App);
