import React, { Component } from 'react';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';
import mime from 'mime-types';


export default class FileModal extends Component {
  state = {
    file: null,
    allowedTypes: ['image/jpeg', 'image/png'],
  }

  clearFile = () => { this.setState({ file: null }) };

  handleFileUpload = event => {
    const file = event.target.files[0];
    if (file) {
      this.setState({ file });
    }
  }

  isFileAllowed = fileName => this.state.allowedTypes.includes(mime.lookup(fileName));

  sendFile = () => {
    const { file } = this.state;
    const { uploadFile, onClose } = this.props;

    if (this.isFileAllowed(file.name)) {
      const metadata = { contentType: mime.lookup(file.name) };
      uploadFile(file, metadata);
      onClose();
      this.clearFile();
    }
  }

  render() {
    const { isVisible, onClose } = this.props;

    return (
      <Modal
        basic
        onClose={onClose}
        open={isVisible}
      >
        <Modal.Header>Select an Image File</Modal.Header>
        <Modal.Content>
          <Input
            type='file'
            name='file'
            fluid
            label='file types: .jpg, .png'
            onChange={this.handleFileUpload}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            color='green'
            inverted
            onClick={this.sendFile}
          >
            <Icon name='checkmark' /> Send
          </Button>
          <Button
            color='red'
            inverted
            onClick={onClose}
          >
            <Icon name='remove' /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
