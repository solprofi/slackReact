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
import firebase from '../../firebase';

export default class Login extends Component {

  state = {
    email: '',
    password: '',
    errors: [],
    isLoading: false,
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = event => {
    event.preventDefault();
    const {
      email,
      password,
      errors,
    } = this.state;

    if (this.isFormValid(email, password)) {
      this.setState({
        errors: [],
        isLoading: true,
      });

      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(loggedInUser => {
          console.log(loggedInUser);
        })
        .catch(error => {
          this.setState({
            errors: [...errors, error],
            isLoading: false,
          });
        });

    }
  }

  isFormValid = (email, password) => email && password;

  handleInputError = inputName => {
    return this.state.errors.some(error =>
      error.message.toLowerCase().includes(inputName)
    )
      ? 'error'
      : '';
  }


  renderErrors = () => this.state.errors.map((error, i) => <p key={i}>{error.message}</p>)

  render() {
    const {
      email,
      password,
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
            color='violet'
            icon
            textAlign='center'
          >
            <Icon name='code branch' color='violet' />
            Login to DevChat
          </Header>

          <Form size='large' onSubmit={this.handleSubmit}>
            <Segment stacked>
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

              <Button
                size='large'
                color='violet'
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
            Don't have an account? &nbsp;
            <Link to='/register'>Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}
