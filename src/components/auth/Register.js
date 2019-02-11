import React, { Component } from 'react';
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import md5 from 'md5';

import firebase from '../../firebase';

export default class Register extends Component {

  state = {
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    errors: [],
    isLoading: false,
    usersRef: firebase.database().ref('users'),
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  isFormEmpty = () => {
    const {
      userName,
      email,
      password,
      confirmPassword
    } = this.state;

    return !userName.length ||
      !email.length ||
      !password.length ||
      !confirmPassword.length;
  }

  isFormValid = () => {
    let errors = [];
    let error = {};

    if (this.isFormEmpty()) {
      error.message = 'Fill in all fields';
      this.setState({
        errors: [...errors, error]
      });
      return false;
    } else if (!this.isPasswordValid()) {
      error.message = 'Password is invalid';
      this.setState({
        errors: [...errors, error]
      });
      return false;
    } else {
      return true;
    }
  }

  isPasswordValid = () => {
    const { password, confirmPassword } = this.state;
    return password.length >= 6
      && confirmPassword.length >= 6
      && password === confirmPassword;
  }

  handleSubmit = event => {
    event.preventDefault();

    if (this.isFormValid()) {
      const {
        email,
        password,
        errors,
        userName,
      } = this.state;

      this.setState({
        errors: [],
        isLoading: true,
      });

      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(createdUser => {
          const { user } = createdUser;

          user.updateProfile({
            displayName: userName,
            photoURL: `http://gravatar.com/avatar/${md5(user.email)}?d=identicon`,
          }).then(() => {
            this.saveUser(createdUser).then(() => {
              this.setState({
                isLoading: false,
              });
            })
          })
            .catch(error => {
              this.setState({
                isLoading: false,
                errors: [...errors, error]
              });
            })

        })
        .catch(error => {
          this.setState({
            isLoading: false,
            errors: [...errors, error],
          });
        });
    }
  }

  handleInputError = inputName => {
    return this.state.errors.some(error =>
      error.message.toLowerCase().includes(inputName)
    )
      ? 'error'
      : '';
  }

  saveUser = createdUser => {
    const { user } = createdUser;

    return this.state.usersRef.child(createdUser.user.uid).set({
      name: user.displayName,
      avatar: user.photoURL,
    });
  }

  renderErrors = () => this.state.errors.map((error, i) => <p key={i}>{error.message}</p>)

  render() {
    const {
      userName,
      email,
      password,
      confirmPassword,
      errors,
      isLoading,
    } = this.state;

    return (
      <Grid
        textAlign='center'
        verticalAlign='middle'
        className='app'
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header
            as='h1'
            color='orange'
            icon
            textAlign='center'
          >
            <Icon name='puzzle piece' color='orange' />
            Register for DevChat
          </Header>

          <Form size='large' onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                name='userName'
                fluid
                icon='user'
                iconPosition='left'
                onChange={this.handleChange}
                type='text'
                placeholder='User Name'
                value={userName}
              />
              <Form.Input
                name='email'
                fluid
                icon='mail'
                iconPosition='left'
                onChange={this.handleChange}
                type='email'
                placeholder='Email'
                value={email}
                className={this.handleInputError('email')}
              />
              <Form.Input
                name='password'
                fluid
                icon='lock'
                iconPosition='left'
                onChange={this.handleChange}
                type='password'
                placeholder='Password'
                value={password}
                className={this.handleInputError('password')}
              />
              <Form.Input
                name='confirmPassword'
                fluid
                icon='repeat'
                iconPosition='left'
                onChange={this.handleChange}
                type='password'
                placeholder='Password Confirmation'
                value={confirmPassword}
                className={this.handleInputError('password')}
              />

              <Button
                size='large'
                color='orange'
                fluid
                disabled={isLoading}
                className={isLoading ? 'loading' : ''}
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {
            errors.length > 0 &&
            <Message error>
              <h2>Error</h2>
              {this.renderErrors()}
            </Message>
          }
          <Message>
            Already a user? &nbsp;
            <Link to='/login'>Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}
