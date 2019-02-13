import React from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';

import './App.css';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';

const App = ({ user, currentChannel, isChannelPrivate, userPosts }) => (
  <Grid columns='equal' className='app'>
    <ColorPanel user={user} key={user && user.name} />
    <SidePanel
      key={user && user.uid}
      user={user}
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
})

export default connect(mapStateToProps)(App);
