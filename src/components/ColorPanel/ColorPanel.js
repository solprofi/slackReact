import React, { Component } from 'react';
import {
  Sidebar,
  Divider,
  Button,
  Menu,
  Modal,
  Icon,
  Label,
  Segment,
} from 'semantic-ui-react';
import { SliderPicker } from 'react-color';

import firebase from '../../firebase';

export default class ColorPanel extends Component {

  state = {
    isModalOpen: false,
    primaryColor: '',
    secondaryColor: '',
    usersRef: firebase.database().ref('users'),
    user: this.props.user,
  }

  openModal = () => { this.setState({ isModalOpen: true }) };

  closeModal = () => { this.setState({ isModalOpen: false }) };

  handleChangePrimary = color => this.setState({ primaryColor: color.hex });

  handleChangeSecondary = color => this.setState({ secondaryColor: color.hex });

  handleSaveColors = () => {
    const { primaryColor, secondaryColor } = this.state;

    if (primaryColor && secondaryColor) {
      this.saveColors(primaryColor, secondaryColor);
    }
  }

  saveColors = (primary, secondary) => {
    this.state.usersRef
      .child(`${this.state.user.uid}/colors`)
      .push()
      .update({
        primary, secondary
      })
      .then(() => {
        console.log('colors added');
        this.closeModal();
      })
      .catch(err => console.error(err));
  }


  render() {
    const {
      isModalOpen,
      primaryColor,
      secondaryColor,
    } = this.state;

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
            <Segment inverted>
              <Label content='Primary Color' />
              <SliderPicker color={primaryColor} onChange={this.handleChangePrimary} />
            </Segment>

            <Segment inverted>
              <Label content='Secondary Color' />
              <SliderPicker color={secondaryColor} onChange={this.handleChangeSecondary} />
            </Segment>
          </Modal.Content>

          <Modal.Actions>
            <Button
              color='green'
              inverted
              onClick={this.handleSaveColors}
            >
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
