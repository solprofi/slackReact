import React, { Component } from 'react'
import {
  Segment,
  Input,
  Button,
} from 'semantic-ui-react';

export default class MessageForm extends Component {
  render() {
    return (
      <Segment className='message__form'>
        <Input
          fluid
          name='message'
          style={{ marginBottom: '0.7em' }}
          label={<Button icon='add' />}
          labelPosition='left'
          placeholder='Write Your Message'
        />

        <Button.Group widths='2'>
          <Button
            color='orange'
            icon='edit'
            labelPosition='left'
            content='Add Reply'
          />
          <Button
            color='teal'
            icon='cloud upload'
            labelPosition='right'
            content='Add Media'
          />
        </Button.Group>
      </Segment>
    )
  }
}
