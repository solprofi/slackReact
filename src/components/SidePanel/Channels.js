import React, { Component, Fragment } from 'react';
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
} from 'semantic-ui-react';


export default class Channels extends Component {
  state = {
    channels: [],
    isModalOpen: false,
    channelName: '',
    channelDetails: '',
  }

  closeModal = () => {
    this.setState({ isModalOpen: false });
  }

  openModal = () => {
    this.setState({ isModalOpen: true });
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

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

        </Menu.Menu>

        <Modal
          open={isModalOpen}
          basic
          onClose={this.closeModal}
        >
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <Input
                  fluid
                  name='channelName'
                  onChange={this.handleInputChange}
                  // value={channelName}
                  label='Channel Name'
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  name='channelDetails'
                  onChange={this.handleInputChange}
                  // value={channelDetails}
                  label='About the Channel'
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='green' inverted>
              <Icon name='checkmark' /> Add
            </Button>
            <Button color='red' inverted>
              <Icon name='remove' /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Fragment>
    )
  }
}
