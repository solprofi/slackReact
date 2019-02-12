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
    searchTerm: '',
    isSearchLoading: false,
    searchResults: [],
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

  handleSearchChange = event => {
    this.setState({
      searchTerm: event.target.value,
      isSearchLoading: true,
    }, () => this.handleSearchMessages());
  }

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const searchResults = channelMessages.filter(message => message.content &&
      (message.content.match(regex) || message.user.name.match(regex)));
    this.setState({ searchResults });
    setTimeout(() => this.setState({ isSearchLoading: false }), 500);
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
      numberOfUsers,
      searchResults,
      searchTerm,
      isSearchLoading,
    } = this.state;

    return (
      <Fragment>
        <MessagesHeader
          isSearchLoading={isSearchLoading}
          numberOfUsers={numberOfUsers}
          channelName={this.displayChannelName(currentChannel)}
          handleSearchChange={this.handleSearchChange}
        />

        <Segment>
          <Comment.Group className='messages'>
            {searchTerm ? this.renderMessages(searchResults) : this.renderMessages(messages)}
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
