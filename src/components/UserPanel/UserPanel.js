import React, { Component } from 'react';
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
} from 'semantic-ui-react';
import firebase from '../../firebase';

class UserPanel extends Component {
  state = {
    user: this.props.user,
  }

  getDropdownOptions = () => [
    {
      text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
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
    const { user } = this.state;

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
            <Header
              as='h4'
              style={{ padding: '0.25em' }}
              inverted
            >
              <Dropdown trigger={
                <span>
                  <Image
                    avatar
                    src={user.photoURL}
                    spaced='right'
                  />
                  {user.displayName}
                </span>
              }
                options={this.getDropdownOptions()} />
            </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    )
  }
}

export default UserPanel;