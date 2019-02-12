import React, { Component } from 'react'
import { Menu, Icon } from 'semantic-ui-react';
import firebase from '../../firebase';

export default class DirectMessages extends Component {
  state = {
    users: [],
    user: this.props.user,
    usersRef: firebase.database().ref('users'),
    connectedRef: firebase.database().ref('.info/connected'),
    presenceRef: firebase.database().ref('presence'),
  }

  addListeners = currentUserId => {
    const {
      usersRef,
      connectedRef,
      presenceRef,
    } = this.state;

    usersRef.on('child_added', snap => {
      let loadedUsers = [];

      if (snap.key !== currentUserId) {
        let user = snap.val();
        user.status = 'offline';
        user.uid = snap.key;

        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });


    connectedRef.on('value', snap => {
      if (snap.val() === true) {
        const ref = presenceRef.child(currentUserId);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.error(err);
          }
        })
      }
    });

    presenceRef.on('child_added', snap => {
      if (currentUserId !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });

    presenceRef.on('child_removed', snap => {
      if (currentUserId !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });

  }

  addStatusToUser = (userId, isConnected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (userId === user.uid) {
        user.status = isConnected ? 'online' : 'offline';
      }
      return acc.concat(user);
    }, []);

    this.setState({
      users: updatedUsers
    });
  }


  componentDidMount = () => {
    const { user } = this.state;
    if (user) {
      this.addListeners(user.uid);
    }
  }

  isUserOnline = user => user.status === 'online';

  render() {
    const { users } = this.state;


    return (
      <Menu.Menu className='menu'>
        <Menu.Item>
          <span>
            <Icon name='mail' /> DIRECT MESSAGES
          </span>{' '}
          ({users.length})
        </Menu.Item>
        {users.map(user => (
          <Menu.Item
            key={user.uid}
            style={{ opacity: 0.7, fontStyle: 'italic' }}
            onClick={() => console.log(user)}
          >
            <Icon
              name='circle'
              color={this.isUserOnline(user) ? 'green' : 'red'}
            />
            @ {user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    )
  }
}
