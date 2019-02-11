import React, { Component, Fragment } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import firebase from '../../firebase';
import Message from './Message';

export default class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    currentChannel: this.props.currentChannel,
    user: this.props.user,
    messages: [],
    messagesLoading: true,
  }

  addListeners = channelID => {
    this.addMessageListener(channelID);
  }

  addMessageListener = channelID => {
    let addedMessages = [];
    this.state.messagesRef.child(channelID).on('child_added', snap => {
      addedMessages.push(snap.val());
      this.setState({
        messages: addedMessages,
        messagesLoading: false,
      });
    });
  }

  componentDidMount = () => {
    const { currentChannel, user } = this.state;

    if (currentChannel && user) {
      this.addListeners(currentChannel.id);
    }
  }

  renderMessages = messages => (
    messages.length > 0 && messages.map(message => (
      <Message
        key={message.timeStamp}
        message={message}
        user={this.state.user}
      />
    ))
  )


  render() {
    const {
      messagesRef,
      currentChannel,
      user,
      messages,
    } = this.state;

    console.log(this.state)
    return (
      <Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className='messages'>
            {this.renderMessages(messages)}
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
