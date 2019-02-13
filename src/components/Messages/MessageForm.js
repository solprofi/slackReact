import React, { Component } from 'react'
import {
  Segment,
  Input,
  Button,
} from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';

import firebase from '../../firebase';
import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

export default class MessageForm extends Component {
  state = {
    message: '',
    isLoading: false,
    channel: this.props.currentChannel,
    user: this.props.user,
    errors: [],
    isFileModalVisible: false,
    uploadState: '',
    uploadTask: null,
    storageRef: firebase.storage().ref(),
    typingRef: firebase.database().ref('typing'),
    percentUploaded: 0,
  }

  closeFileModal = () => this.setState({ isFileModalVisible: false });

  createMessage = (fileUrl = null) => {
    const { message: stateMessage, user } = this.state;

    const message = {
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        avatar: user.photoURL,
        name: user.displayName,
      }
    }

    if (fileUrl !== null) {
      message.image = fileUrl;
    } else {
      message.content = stateMessage;
    }

    return message;
  }

  getPath = () => {
    return this.props.isChannelPrivate ? `chat/private-${this.state.channel.id}/` : 'chat/public/';
  }

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleKeyDown = () => {
    const {
      typingRef,
      message,
      channel,
      user,
    } = this.state;

    if (message) {
      typingRef
        .child(channel.id)
        .child(user.uid)
        .set(user.displayName)
    } else {
      typingRef
        .child(channel.id)
        .child(user.uid)
        .remove();
    }
  }

  openFileModal = () => this.setState({ isFileModalVisible: true });

  sendMessage = () => {
    const {
      message,
      channel,
      errors,
      typingRef,
      user,
    } = this.state;
    const { getMessageRef } = this.props;

    if (message) {
      this.setState({
        isLoading: true,
      })

      getMessageRef()
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({
            isLoading: false,
            message: '',
            errors: [],
          });
          typingRef
            .child(channel.id)
            .child(user.uid)
            .remove();
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

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref.child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: 'done' });
      })
      .catch(err => this.setState({
        errors: this.state.errors.concat(err)
      }));
  }

  uploadFile = (file, metadata) => {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.getMessageRef();
    const filePath = `${this.getPath()}${uuidv4()}.jpg`;

    this.setState({
      uploadState: 'uploading',
      uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
    },
      () => {
        this.state.uploadTask.on('state_changed', snap => {
          const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);

          this.setState({
            percentUploaded,
          });
        },
          err => {
            this.setState({
              errors: this.state.errors.concat(err),
              uploadTask: null,
              uploadState: 'error',
            })
          },
          () => {
            this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              this.sendFileMessage(downloadURL, ref, pathToUpload);
            },
              err => {
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadTask: null,
                  uploadState: 'error',
                })
              })
          }
        )
      }
    )
  }

  render() {
    const {
      message,
      isLoading,
      errors,
      isFileModalVisible,
      uploadState,
      percentUploaded,
    } = this.state;

    return (
      <Segment className='message__form'>
        <Input
          fluid
          name='message'
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
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
            disabled={uploadState === 'uploading'}
          />

        </Button.Group>
        <FileModal
          onClose={this.closeFileModal}
          isVisible={isFileModalVisible}
          uploadFile={this.uploadFile}
        />
        <ProgressBar percentUploaded={percentUploaded} uploadState={uploadState} />
      </Segment>
    )
  }
}
