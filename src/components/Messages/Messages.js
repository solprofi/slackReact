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
    numberOfUsers: 0,
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

      this.countUniqueUsers(addedMessages);
    });
  }

  componentDidMount = () => {
    const { currentChannel, user } = this.state;

    if (currentChannel && user) {
      this.addListeners(currentChannel.id);
    }
  }

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);

    this.setState({
      numberOfUsers: uniqueUsers.length,
    });
  }

  displayChannelName = channel => channel ? `#${channel.name}` : '';

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
      numberOfUsers,
    } = this.state;

    return (
      <Fragment>
        <MessagesHeader numberOfUsers={numberOfUsers} channelName={this.displayChannelName(currentChannel)} />

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
