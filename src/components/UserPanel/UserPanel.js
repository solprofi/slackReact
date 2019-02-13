import React, { Component } from 'react';
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button,
} from 'semantic-ui-react';
import AvatarEditor from 'react-avatar-editor';

import firebase from '../../firebase';

class UserPanel extends Component {
  state = {
    user: this.props.user,
    isModalOpen: false,
    previewImage: '',
    croppedImage: '',
    blob: '',
    storageRef: firebase.storage().ref(),
    userRef: firebase.auth().currentUser,
    usersRef: firebase.database().ref('users'),
    metadata: {
      contentType: 'image/jpeg',
    },
    uploadedCroppedImage: '',
  }

  changeAvatar = () => {
    this.state.userRef
      .updateProfile({
        photoURL: this.state.uploadedCroppedImage,
      })
      .then(() => {
        console.log('photo url updated');
        this.closeModal();
      })
      .catch(err => {
        console.error(err)
      });

    this.state.usersRef
      .child(this.state.user.uid)
      .update({ avatar: this.state.uploadedCroppedImage })
      .then(() => {
        console.log('avatar successfully updated');
      })
      .catch(err => {
        console.error(err)
      });
  }

  closeModal = () => { this.setState({ isModalOpen: false }); }

  getDropdownOptions = () => [
    {
      text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
      disabled: true,
      key: 'user',
    },
    {
      text: <span onClick={this.openModal}>Change Avatar</span>,
      key: 'avatar',
    },
    {
      text: <span onClick={this.handleSignOut}>Sign Out</span>,
      key: 'signOut',
    }
  ]

  handleChange = event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        this.setState({ previewImage: reader.result });
      });
    }
  }

  handleCropImage = () => {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
        const imageUrl = URL.createObjectURL(blob);

        this.setState({
          croppedImage: imageUrl,
          blob
        });
      });
    }
  }

  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('signed Out'))
  }

  openModal = () => { this.setState({ isModalOpen: true }); }

  uploadCroppedImage = () => {
    const {
      userRef,
      storageRef,
      blob,
      metadata,
    } = this.state;

    storageRef
      .child(`avatars/user-${userRef.uid}`)
      .put(blob, metadata)
      .then(snap => {
        snap.ref.getDownloadURL().then(downloadUrl => {
          this.setState({ uploadedCroppedImage: downloadUrl }, () => {
            this.changeAvatar();
          });
        })
      });
  }

  render() {
    const {
      user,
      isModalOpen,
      previewImage,
      croppedImage,
    } = this.state;
    const { primaryColor } = this.props;

    return (
      <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
            <Header
              inverted
              floated='left'
              as='h2'
            >
              <Icon name='code' />
              <Header.Content>DevChat</Header.Content>
            </Header>
            <Header
              as='h4'
              style={{ padding: '0.25em' }}
              inverted
            >
              <Dropdown trigger={
                <span>
                  <Image
                    avatar
                    src={user.photoURL}
                    spaced='right'
                  />
                  {user.displayName}
                </span>
              }
                options={this.getDropdownOptions()} />
            </Header>
          </Grid.Row>

          <Modal
            basic
            open={isModalOpen}
            onClose={this.closeModal}
          >
            <Modal.Header>Change User Avatar</Modal.Header>
            <Modal.Content>

              <Input
                type='file'
                label='Change User Avatar'
                fluid
                name='previewImage'
                onChange={this.handleChange}
              />
              <Grid
                centered
                stackable
                columns={2}
              >
                <Grid.Row centered>
                  <Grid.Column className='ui center aligned grid'>
                    {previewImage && <AvatarEditor
                      image={previewImage}
                      width={120}
                      height={120}
                      border={50}
                      scale={1.2}
                      ref={node => this.avatarEditor = node}
                    />
                    }
                  </Grid.Column>
                  <Grid.Column>
                    {croppedImage &&
                      <Image
                        style={{ margin: '3.5em auto' }}
                        width={120}
                        height={120}
                        src={croppedImage}
                      />
                    }
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              {croppedImage &&
                <Button
                  color='green'
                  inverted
                  onClick={this.uploadCroppedImage}
                >
                  <Icon name='save' /> Save Image
              </Button>
              }
              <Button
                color='green'
                inverted
                onClick={this.handleCropImage}
              >
                <Icon name='image' /> Preview
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
        </Grid.Column>
      </Grid>
    )
  }
}

export default UserPanel;