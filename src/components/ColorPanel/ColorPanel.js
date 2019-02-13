import React, { Component } from 'react';
import {
  Sidebar,
  Divider,
  Button,
  Menu,
  Modal,
  Icon,
  Label,
} from 'semantic-ui-react';

import { SliderPicker } from 'react-color';

export default class ColorPanel extends Component {

  state = {
    isModalOpen: false,
  }

  openModal = () => { this.setState({ isModalOpen: true }) };

  closeModal = () => { this.setState({ isModalOpen: false }) };

  render() {
    const { isModalOpen } = this.state;

    return (
      <Sidebar
        inverted
        vertical
        visible
        width='very thin'
        icon='labeled'
        as={Menu}
      >
        <Divider />
        <Button
          inverted
          color='blue'
          icon='add'
          onClick={this.openModal}
        />

        <Modal
          open={isModalOpen}
          basic
          onClose={this.closeModal}
        >
          <Modal.Header>Choose App Colors</Modal.Header>
          <Modal.Content>
            <Label content='Primary Color' />
            <SliderPicker />

            <Label content='Secondary Color' />
            <SliderPicker />
          </Modal.Content>

          <Modal.Actions>
            <Button color='green' inverted>
              <Icon name='checkmark' /> Save Color
            </Button>
            <Button
              color='red'
              inverted
              onClick={this.closeModal}
            >
              <Icon name='remove' /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>

      </Sidebar>
    )
  }
}
