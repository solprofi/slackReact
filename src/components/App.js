import React from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';

import './App.css';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';

const App = props => (
  <Grid columns='equal' className='app'>
    <ColorPanel />
    <SidePanel currentUser={props.currentUser} />

    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages />
    </Grid.Column>

    <Grid.Column width='4'>
      <MetaPanel />
    </Grid.Column>
  </Grid>
)

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
})

export default connect(mapStateToProps)(App);
