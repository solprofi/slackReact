import React, { Component } from 'react';
import {
  Segment,
  Accordion,
  Header,
  Icon,
  Image,
  List,
} from 'semantic-ui-react';

export default class MetaPanel extends Component {
  state = {
    activeIndex: 0,
    isChannelPrivate: this.props.isChannelPrivate,
    channel: this.props.currentChannel,
  }

  formatPosts = count => `post${count !== 1 && 's'}`;

  renderTopPosters = posts => (
    Object.entries(posts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value], index) => (
        <List.Item key={index}>
          <Image avatar src={value.avatar} />
          <List.Content>
            <List.Header as='a' >{key}</List.Header>
            <List.Description>{value.count} {this.formatPosts(value.count)}</List.Description>
          </List.Content>
        </List.Item>
      )).slice(0, 5)
  )

  setActiveIndex = (event, titleProps) => {
    const { activeIndex } = this.state;
    const { index } = titleProps;

    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const {
      activeIndex,
      isChannelPrivate,
      channel,
    } = this.state;

    const { userPosts } = this.props;

    if (isChannelPrivate) return null;

    return (
      <Segment loading={!channel}>
        <Header as='h3' attached='top'>About # {channel && channel.name}</Header>
        <Accordion>
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.setActiveIndex}
          >
            <Icon name='dropdown' />
            <Icon name='info' />
            Channel Details
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0} >
            {channel && channel.details}
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={this.setActiveIndex}
          >
            <Icon name='dropdown' />
            <Icon name='user circle' />
            Top Posters
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1} >
            <List>
              {userPosts && this.renderTopPosters(userPosts)}
            </List>
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 2}
            index={2}
            onClick={this.setActiveIndex}
          >
            <Icon name='dropdown' />
            <Icon name='pencil alternate' />
            Created By
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2} >
            <Header>
              <Image circular src={channel && channel.createdBy.avatar} />
              {channel && channel.createdBy.name}
            </Header>
          </Accordion.Content>
        </Accordion>
      </Segment>
    )
  }
}
