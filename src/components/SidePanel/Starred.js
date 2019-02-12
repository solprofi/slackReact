import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setPrivateChannel, setCurrentChannel } from '../../actions';
import { Menu, Icon } from 'semantic-ui-react';


class Starred extends Component {
  state = {
    starredChannels: [],
    activeChannel: '',
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

  setCurrentChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  }

  setActiveChannel = channel => {
    this.setState({
      activeChannel: channel.id,
    });
  }

  render() {
    const { starredChannels } = this.state;

    return (
      <Menu.Menu className='menu'>
        <Menu.Item>
          <span>
            <Icon name='star' /> STARRED
        </span>
          {' '}
          ({starredChannels.length})
        </Menu.Item>

        {this.renderChannels(starredChannels)}
      </Menu.Menu>
    )
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);