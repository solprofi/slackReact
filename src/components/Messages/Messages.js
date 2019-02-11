import React, { Component, Fragment } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import firebase from '../../firebase';

export default class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    currentChannel: this.props.currentChannel,
    user: this.props.user,
  }

  render() {
    const {
      messagesRef,
      currentChannel,
      user,
    } = this.state;
    return (
      <Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className='messages'>

          </Comment.Group>
        </Segment>

        <MessageForm
          currentChannel={currentChannel}
          messagesRef={messagesRef}
          user={user}
        />

      </Fragment>
    )
  }
}
