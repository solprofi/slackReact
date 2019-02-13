import React, { Component, Fragment } from 'react';
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Label,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import { setCurrentChannel, setPrivateChannel } from '../../actions';
import firebase from '../../firebase';

class Channels extends Component {
  state = {
    channels: [],
    isModalOpen: false,
    channel: null,
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'),
    messagesRef: firebase.database().ref('messages'),
    typingRef: firebase.database().ref('typing'),
    notifications: [],
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
      this.addNotificationListener(snap.key);
    });
  }

  addNotificationListener = channelId => {
    const {
      messagesRef,
      notifications,
    } = this.state;

    messagesRef.child(channelId).on('value', snap => {
      if (this.state.channel) {
        this.handleNotificationChange(channelId, this.state.channel.id, notifications, snap);
      }
    });
  }

  componentDidMount = () => {
    this.addListeners();
  }

  componentWillUnmount = () => {
    this.removeListeners();
  }

  clearNotifications = () => {
    const { notifications, channel } = this.state;

    const index = notifications.findIndex(notification => notification.id === channel.id);

    if (index !== -1) {
      const newNotifications = [...notifications];
      newNotifications[index].total = notifications[index].lastKnownTotal;
      newNotifications[index].count = 0;

      this.setState({ notifications: newNotifications });
    }
  }

  closeModal = () => {
    this.setState({
      isModalOpen: false,
      channelName: '',
      channelDetails: '',
    });
  }

  getNotificationCount = channel => {
    let count = 0;

    this.state.notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
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

  handleNotificationChange = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;

    let index = notifications.findIndex(notification => notification.id === channelId);

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }

        notifications[index].lastKnownTotal = snap.numChildren();
      }
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0.
      });
    }

    this.setState({
      notifications
    });
  }

  isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

  openModal = () => {
    this.setState({ isModalOpen: true });
  }

  setCurrentChannel = channel => {
    this.setActiveChannel(channel);
    this.state.typingRef
      .child(this.state.channel.id)
      .child(this.state.user.uid)
      .remove();
    this.clearNotifications()
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
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
      this.setState({ channel: firstChannel });
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
        {this.getNotificationCount(channel) && <Label color='red'>{this.getNotificationCount(channel)}</Label>}
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
        <Menu.Menu className='menu'>
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

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);