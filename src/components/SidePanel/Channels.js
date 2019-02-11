import React, { Component, Fragment } from 'react';
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import { setCurrentChannel } from '../../actions/index';
import firebase from '../../firebase';

class Channels extends Component {
  state = {
    channels: [],
    isModalOpen: false,
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'),
    user: this.props.user,
    isFirstLoad: true,
    activeChannel: '',
  }

  addChanel = () => {
    const {
      channelName,
      channelDetails,
      channelsRef,
      user,
    } = this.state;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL,
      }
    }

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.closeModal();
      })
      .catch(error => {
        console.error(error);
      });
  }

  addListeners = () => {
    const addedChannels = [];

    this.state.channelsRef.on('child_added', snap => {
      addedChannels.push(snap.val());
      this.setState({ channels: addedChannels }, () => this.setFirstChannel());
    });
  }

  componentDidMount = () => {
    this.addListeners();
  }

  componentWillUnmount = () => {
    this.removeListeners();
  }

  closeModal = () => {
    this.setState({
      isModalOpen: false,
      channelName: '',
      channelDetails: '',
    });
  }

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();

    if (this.isFormValid(this.state)) {
      this.addChanel();
    }
  }

  isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

  openModal = () => {
    this.setState({ isModalOpen: true });
  }

  setCurrentChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
  }

  setActiveChannel = channel => {
    this.setState({
      activeChannel: channel.id,
    });
  }

  setFirstChannel = () => {
    const { channels, isFirstLoad } = this.state;
    const firstChannel = channels[0];

    if (channels.length > 0 && isFirstLoad) {
      this.setActiveChannel(firstChannel);
      this.props.setCurrentChannel(firstChannel);
    }

    this.setState({ isFirstLoad: false });
  }

  removeListeners = () => {
    this.state.channelsRef.off();
  }

  renderChannels = channels => (
    channels.length > 0 && channels.map(channel => (
      <Menu.Item
        key={channel.id}
        name={channel.name}
        onClick={() => this.setCurrentChannel(channel)}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ))
  )

  render() {
    const {
      channels,
      isModalOpen,
      channelName,
      channelDetails,
    } = this.state;

    return (
      <Fragment>
        <Menu.Menu style={{ paddingBottom: '2em' }}>
          <Menu.Item>
            <span>
              <Icon name='exchange' /> CHANNELS
          </span>
            {' '}
            ({channels.length}) <Icon name='add' onClick={this.openModal} />
          </Menu.Item>

          {this.renderChannels(channels)}
        </Menu.Menu>

        <Modal
          open={isModalOpen}
          basic
          onClose={this.closeModal}
        >
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  name='channelName'
                  onChange={this.handleInputChange}
                  label='Channel Name'
                  value={channelName}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  name='channelDetails'
                  onChange={this.handleInputChange}
                  label='About the Channel'
                  value={channelDetails}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color='green'
              inverted
              onClick={this.handleSubmit}
            >
              <Icon name='checkmark' /> Add
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
      </Fragment>
    )
  }
}

export default connect(null, { setCurrentChannel })(Channels);