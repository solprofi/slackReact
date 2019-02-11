import React from 'react';
import { Comment } from 'semantic-ui-react';
import moment from 'moment';

const timeFromNow = date => moment(date).fromNow();

const isOwnMessage = (message, user) => message.user.id === user.uid;

const Message = ({ message, user }) => (
  <Comment>
    <Comment.Avatar src={message.user.avatar} />
    <Comment.Content className={isOwnMessage(message, user) ? 'message__self' : ''}>
      <Comment.Author as='a'>{message.user.name}</Comment.Author>
      <Comment.Metadata>{timeFromNow(message.timeStamp)}</Comment.Metadata>
      <Comment.Text>{message.content}</Comment.Text>
    </Comment.Content>
  </Comment>
)

export default Message;
