import React, { Component } from 'react';
import { Segment, Accordion, Header, Icon } from 'semantic-ui-react';

export default class MetaPanel extends Component {
  state = {
    activeIndex: 0,
    isChannelPrivate: this.props.isChannelPrivate,
  }

  setActiveIndex = (event, titleProps) => {
    const { activeIndex } = this.state;
    const { index } = titleProps;

    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex, isChannelPrivate } = this.state;

    if (isChannelPrivate) return null;

    return (
      <Segment>
        <Header as='h3' attached='top'>About # Channel</Header>
        <Accordion>
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.setActiveIndex}
          >
            <Icon name='dropdown' />
            <Icon name='info' />
            Channel Detaild
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0} >
            details
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
            user
          </Accordion.Content>
        </Accordion>
      </Segment>
    )
  }
}
