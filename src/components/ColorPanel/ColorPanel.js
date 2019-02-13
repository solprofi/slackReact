import React, { Component, Fragment } from 'react';
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
import { connect } from 'react-redux';

import { setColors } from '../../actions';

import firebase from '../../firebase';

class ColorPanel extends Component {

  state = {
    isModalOpen: false,
    primaryColor: '',
    secondaryColor: '',
    usersRef: firebase.database().ref('users'),
    user: this.props.user,
    userColors: [],
  }

  addListeners = userId => {
    let colors = [];

    this.state.usersRef
      .child(`${userId}/colors`)
      .on('child_added', snap => {
        colors.unshift(snap.val());
        this.setState({ userColors: colors })
      });
  }

  componentDidMount = () => {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  closeModal = () => { this.setState({ isModalOpen: false }) };

  handleChangePrimary = color => this.setState({ primaryColor: color.hex });

  handleChangeSecondary = color => this.setState({ secondaryColor: color.hex });

  handleSaveColors = () => {
    const { primaryColor, secondaryColor } = this.state;

    if (primaryColor && secondaryColor) {
      this.saveColors(primaryColor, secondaryColor);
    }
  }

  openModal = () => { this.setState({ isModalOpen: true }) };

  renderColors = colors => (
    colors.length > 0 && colors.map((color, index) => (
      <Fragment key={index}>
        <Divider />
        <div className='color__container' onClick={() => this.props.setColors(color.primary, color.secondary)}>
          <div className='color__square' style={{ background: color.primary }}>
            <div className='color__overlay' style={{ background: color.secondary }}>
            </div>
          </div>
        </div>

      </Fragment>
    ))
  )

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
      userColors,
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

        {this.renderColors(userColors)}

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

export default connect(null, { setColors })(ColorPanel);