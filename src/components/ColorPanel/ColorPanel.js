import React, { Component } from 'react';
import {
  Sidebar,
  Divider,
  Button,
  Menu,
} from 'semantic-ui-react';

export default class ColorPanel extends Component {
  render() {
    return (
      <Sidebar
        inverted
        vertical
        visible
        width='very thin'
        icon='labeled'
        as={Menu}
      >
        <Divider />
        <Button
          inverted
          color='blue'
          icon='add'
        />

      </Sidebar>
    )
  }
}
