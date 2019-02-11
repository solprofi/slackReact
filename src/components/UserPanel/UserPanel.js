import React, { Component } from 'react';
import {
  Grid,
  Header,
  Icon,
  Dropdown,
} from 'semantic-ui-react';
import firebase from '../../firebase';

class UserPanel extends Component {
  state = {
    currentUser: this.props.currentUser,
  }

  getDropdownOptions = () => [
    {
      text: <span>Signed in as <strong>{this.state.currentUser.displayName}</strong></span>,
      disabled: true,
      key: 'user',
    },
    {
      text: <span>Change Avatar</span>,
      key: 'avatar',
    },
    {
      text: <span onClick={this.handleSignOut}>Sign Out</span>,
      key: 'signOut',
    }
  ]

  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('signed Out'))
  }

  render() {
    console.log(this.props.currentUser);
    return (
      <Grid>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
            <Header
              inverted
              floated='left'
              as='h2'
            >
              <Icon name='code' />
              <Header.Content>DevChat</Header.Content>
            </Header>
          </Grid.Row>
          <Header
            as='h4'
            style={{ padding: '0.25em' }}
            inverted
          >
            <Dropdown trigger={<span>{this.state.currentUser.displayName}</span>} options={this.getDropdownOptions()} />
          </Header>
        </Grid.Column>
      </Grid>
    )
  }
}

export default UserPanel;