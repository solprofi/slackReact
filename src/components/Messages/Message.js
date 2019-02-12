import React from 'react';
import { Comment, Image } from 'semantic-ui-react';
import moment from 'moment';

const timeFromNow = date => moment(date).fromNow();

const isImage = message => message.hasOwnProperty('image') && !message.hasOwnProperty('content');

const isOwnMessage = (message, user) => message.user.id === user.uid;


const Message = ({ message, user }) => (
  <Comment>
    <Comment.Avatar src={message.user.avatar} />
    <Comment.Content className={isOwnMessage(message, user) ? 'message__self' : ''}>
      <Comment.Author as='a'>{message.user.name}</Comment.Author>
      <Comment.Metadata>{timeFromNow(message.timeStamp)}</Comment.Metadata>
      {isImage(message) ? <Image src={message.image} className='message__image' /> :
        <Comment.Text>{message.content}</Comment.Text>
      }
    </Comment.Content>
  </Comment>
)

export default Message;
