import React, { Component } from 'react';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';


export default class FileModal extends Component {
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
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' inverted>
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
