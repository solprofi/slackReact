import React, { Component } from 'react';
import { Segment, Accordion, Header, Icon, Image } from 'semantic-ui-react';

export default class MetaPanel extends Component {
  state = {
    activeIndex: 0,
    isChannelPrivate: this.props.isChannelPrivate,
    channel: this.props.currentChannel,
  }

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
            Posters
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
