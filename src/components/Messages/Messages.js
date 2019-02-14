import React, { Component, Fragment } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { setUserPosts } from '../../actions';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import firebase from '../../firebase';
import Message from './Message';
import Typing from './Typing';
import Skeleton from './Skeleton';


class Messages extends Component {
  state = {
    usersRef: firebase.database().ref('users'),
    messagesRef: firebase.database().ref('messages'),
    privateMessagesRef: firebase.database().ref('privateMessages'),
    typingRef: firebase.database().ref('typing'),
    connectedRef: firebase.database().ref('.info/connected'),
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
    typingUsers: [],
    listeners: [],
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
    this.addTypingListener(channelId);
  }

  addMessageListener = channelId => {
    let addedMessages = [];
    const messagesRef = this.getMessageRef();

    messagesRef.child(channelId).on('child_added', snap => {
      addedMessages.push(snap.val());
      this.setState({
        messages: addedMessages,
        messagesLoading: false,
      });

      this.countUniqueUsers(addedMessages);
      this.countUserPosts(addedMessages);
    });

    this.addToListeners(channelId, messagesRef, 'child_added');
  }

  addToListeners = (id, ref, event) => {
    const index = this.state.listeners.findIndex(listener => {
      return listener.id === id && listener.ref === ref && listener.event === event;
    });

    if (index === -1) {
      const newListener = { id, ref, event };
      this.setState({
        listeners: this.state.listeners.concat(newListener),
      });
    }
  }

  addTypingListener = channelId => {
    let typingUsers = [];

    this.state.typingRef
      .child(channelId)
      .on('child_added', snap => {
        if (snap.key !== this.state.user.uid) {
          typingUsers = typingUsers.concat({
            id: snap.key,
            name: snap.val(),
          });
          this.setState({ typingUsers });
        }
      });

    this.addToListeners(channelId, this.state.typingRef, 'child_added');

    this.state.typingRef
      .child(channelId)
      .on('child_removed', snap => {
        const index = typingUsers.findIndex(user => user.id === snap.key);

        if (index !== -1) {
          typingUsers = typingUsers.filter(user => user.id !== snap.key);
          this.setState({ typingUsers });
        }
      });

    this.addToListeners(channelId, this.state.typingRef, 'child_removed');

    this.state.connectedRef.on('value', snap => {
      if (snap.val() === true) {
        this.state.typingRef
          .child(channelId)
          .child(this.state.user.uid)
          .onDisconnect()
          .remove(err => {
            if (err !== null) {
              console.error(err);
            }
          });
      }
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
    const {
      currentChannel,
      user,
      listeners,
    } = this.state;

    if (currentChannel && user) {
      this.removeListeners(listeners);
      this.addListeners(currentChannel.id);
      this.addUsersStarsListener(currentChannel.id, user.uid);
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.messagesEnd) {
      this.scrollToBottom();
    }
  }

  componentWillUnmount = () => {
    this.removeListeners(this.state.listeners);
    this.state.connectedRef.off();
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

  removeListeners = listeners => {
    listeners.forEach(listener => {
      listener.ref
        .child(listener.id)
        .off(listener.event);
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

  renderMessageSkeleton = isLoading => (
    isLoading ? (
      <Fragment>
        {[...Array(10)].map((val, index) => (
          <Skeleton key={index} />
        ))}
      </Fragment>
    ) : null
  )

  renderTypingUsers = typingUsers => (
    typingUsers.length > 0 && typingUsers.map(user => (
      <div
        key={user.id}
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '0.2em'
        }}>
        <span className='user__typing'>{user.name} is typing</span>
        <Typing />
      </div>
    ))
  )

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  }

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
      typingUsers,
      messagesLoading,
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
            {this.renderMessageSkeleton(messagesLoading)}
            {searchTerm ? this.renderMessages(searchResults) : this.renderMessages(messages)}
            {this.renderTypingUsers(typingUsers)}
            <div ref={node => this.messagesEnd = node} />
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