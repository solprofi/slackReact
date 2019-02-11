import React, { Component } from 'react';
import {
  Segment,
  Header,
  Icon,
  Input,
} from 'semantic-ui-react';

export default class MessagesHeader extends Component {
  render() {
    return (
      <Segment clearing>
        <Header
          floated='left'
          fluid={true}
          as='h2'
          style={{ paddingBottom: 0 }}
        >
          <span>
            Channel
            <Icon name='star outline' color='black' />
          </span>

          <Header.Subheader>2 Users</Header.Subheader>
        </Header>

        <Header floated='right'>
          <Input
            size='mini'
            icon='search'
            name='searchTerm'
            placeholder='Search Messages'
          />
        </Header>
      </Segment>
    )
  }
}
