import React, { Component } from 'react'
import {
  Segment,
  Input,
  Button,
} from 'semantic-ui-react';
import firebase from '../../firebase';
import FileModal from './FileModal';

export default class MessageForm extends Component {
  state = {
    message: '',
    isLoading: false,
    channel: this.props.currentChannel,
    user: this.props.user,
    errors: [],
    isFileModalVisible: false,
  }

  createMessage = () => {
    const { message, user } = this.state;

    return {
      content: message,
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        avatar: user.photoURL,
        name: user.displayName,
      }
    }
  }

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  openFileModal = () => this.setState({ isFileModalVisible: true });

  closeFileModal = () => this.setState({ isFileModalVisible: false });

  sendMessage = () => {
    const {
      message,
      channel,
      errors,
    } = this.state;
    const { messagesRef } = this.props;

    if (message) {
      this.setState({
        isLoading: true,
      })

      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({
            isLoading: false,
            message: '',
            errors: [],
          })
        })
        .catch(error => {
          this.setState({
            isLoading: false,
            errors: [...errors, error],
          })
        })
    } else {
      this.setState({
        errors: [...errors, {
          message: 'Add a message'
        }],
      })
    }
  }

  render() {
    const {
      message,
      isLoading,
      errors,
      isFileModalVisible,
    } = this.state;

    return (
      <Segment className='message__form'>
        <Input
          fluid
          name='message'
          onChange={this.handleInputChange}
          value={message}
          style={{ marginBottom: '0.7em' }}
          label={<Button icon='add' />}
          labelPosition='left'
          placeholder='Write Your Message'
          className={errors.some(error => error.message.includes('message')) ? 'error' : ''}
        />

        <Button.Group widths='2'>
          <Button
            color='orange'
            icon='edit'
            labelPosition='left'
            content='Add Reply'
            onClick={this.sendMessage}
            disabled={isLoading}
          />
          <Button
            color='teal'
            icon='cloud upload'
            labelPosition='right'
            content='Add Media'
            onClick={this.openFileModal}
          />

          <FileModal onClose={this.closeFileModal} isVisible={isFileModalVisible} />
        </Button.Group>
      </Segment>
    )
  }
}
