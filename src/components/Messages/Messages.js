import React, { Component, Fragment } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { setUserPosts } from '../../actions';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import firebase from '../../firebase';
import Message from './Message';

class Messages extends Component {
  state = {
    usersRef: firebase.database().ref('users'),
    messagesRef: firebase.database().ref('messages'),
    privateMessagesRef: firebase.database().ref('privateMessages'),
    currentChannel: this.props.currentChannel,
    user: this.props.user,
    messages: [],
    messagesLoading: true,
    numberOfUsers: 0,
    searchTerm: '',
    isSearchLoading: false,
    searchResults: [],
    isChannelPrivate: this.props.isChannelPrivate,
    isChannelStarred: false,
  }

  addListeners = channelID => {
    this.addMessageListener(channelID);
  }

  addMessageListener = channelID => {
    let addedMessages = [];
    const messagesRef = this.getMessageRef();

    messagesRef.child(channelID).on('child_added', snap => {
      addedMessages.push(snap.val());
      this.setState({
        messages: addedMessages,
        messagesLoading: false,
      });

      this.countUniqueUsers(addedMessages);
      this.countUserPosts(addedMessages);
    });
  }

  addUsersStarsListener = (channelId, userId) => {
    this.state.usersRef
      .child(userId)
      .child('starred')
      .once('value')
      .then(data => {
        if (data.val() !== null) {
          const starredIds = Object.keys(data.val());
          const wasChannelStarred = starredIds.includes(channelId);

          this.setState({ isChannelStarred: wasChannelStarred });
        }
      })
  }

  componentDidMount = () => {
    const { currentChannel, user } = this.state;

    if (currentChannel && user) {
      this.addListeners(currentChannel.id);
      this.addUsersStarsListener(currentChannel.id, user.uid);
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

  countUserPosts = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        }
      }

      return acc;
    }, {});

    this.props.setUserPosts(userPosts);
  }

  displayChannelName = channel => channel ? `${this.state.isChannelPrivate ? '@' : '#'}${channel.name}` : '';

  getMessageRef = () => {
    const { isChannelPrivate, messagesRef, privateMessagesRef } = this.state;

    return isChannelPrivate ? privateMessagesRef : messagesRef;
  }

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

  handleStar = () => {
    this.setState((prevState => ({
      isChannelStarred: !prevState.isChannelStarred,
    })), () => {
      this.starChannel();
    });
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

  starChannel = () => {
    const {
      isChannelStarred,
      usersRef,
      currentChannel: channel,
      user,
    } = this.state;

    if (isChannelStarred) {
      usersRef
        .child(`${user.uid}/starred`)
        .update({
          [channel.id]: {
            name: channel.name,
            details: channel.details,
            createdBy: {
              name: channel.createdBy.name,
              avatar: channel.createdBy.avatar,
            }
          }
        })
    } else {
      usersRef
        .child(`${user.uid}/starred`)
        .child(channel.id)
        .remove(err => {
          if (err !== null) {
            console.error(err);
          }
        })
    }
  }

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
      isChannelPrivate,
      isChannelStarred,
    } = this.state;

    return (
      <Fragment>
        <MessagesHeader
          isSearchLoading={isSearchLoading}
          numberOfUsers={numberOfUsers}
          channelName={this.displayChannelName(currentChannel)}
          handleSearchChange={this.handleSearchChange}
          isChannelPrivate={isChannelPrivate}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}
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
          isChannelPrivate={isChannelPrivate}
          getMessageRef={this.getMessageRef}
        />

      </Fragment>
    )
  }
}

export default connect(null, { setUserPosts })(Messages);