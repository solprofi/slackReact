import React, { Component } from 'react';
import {
  Segment,
  Header,
  Icon,
  Input,
} from 'semantic-ui-react';

export default class MessagesHeader extends Component {
  render() {
    const {
      channelName,
      numberOfUsers,
      handleSearchChange,
      isSearchLoading,
      isChannelPrivate,
      isChannelStarred,
    } = this.props;

    return (
      <Segment clearing>
        <Header
          floated='left'
          fluid='true'
          as='h2'
          style={{ paddingBottom: 0 }}
        >
          <span>
            {channelName}
            {!isChannelPrivate && (
              <Icon
                onClick={this.props.handleStar}
                name={isChannelStarred ? 'star' : 'star outline'}
                color={isChannelStarred ? 'yellow' : 'black'}
              />)}
          </span>

          <Header.Subheader>{numberOfUsers} {numberOfUsers === 1 ? 'User' : 'Users'}</Header.Subheader>
        </Header>

        <Header floated='right'>
          <Input
            size='mini'
            icon='search'
            name='searchTerm'
            placeholder='Search Messages'
            onChange={handleSearchChange}
            loading={isSearchLoading}
          />
        </Header>
      </Segment>
    )
  }
}
