import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {compose} from 'recompose';
import {Form, Button, Container, Row, Col} from 'react-bootstrap'
import {SignUpLink} from '../SignUp';
import {PasswordForgetLink} from '../PasswordForget';
import {withFirebase} from '../Firebase';
import * as ROUTES from '../../constants/routes';
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {fas} from '@fortawesome/free-solid-svg-icons'

library.add(fab, fas);

const SignInPage = () => (
    <div>
        <Container style={{width: "40%", padding: "5%", backgroundColor: "#f8f9fa", borderRadius: 35
        }}>
            <h1 className="text-center">Sign In</h1>
            <br/>
            <SignInForm/>
            <PasswordForgetLink/>
            <SignUpLink/>
        </Container>
    </div>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS =
    'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = {...INITIAL_STATE};
    }

    onSubmit = event => {
        console.log("hey");
        // const {email, password} = this.state;
        //
        // this.props.firebase
        //     .doSignInWithEmailAndPassword(email, password)
        //     .then(() => {
        //         this.setState({...INITIAL_STATE});
        //         this.props.history.push(ROUTES.HOME);
        //     })
        //     .catch(error => {
        //         this.setState({error});
        //     });
        //
        // event.preventDefault();
    };

    onChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    render() {
        const {email, password, error} = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <div>
                <Form>
                    <Row>
                        <Col>
                            <SignInGoogle/>
                        </Col>
                        <Col>
                            <SignInFacebook/>
                        </Col>
                    </Row>
                    <br/>
                    <h2 className="text-center">OR</h2>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" name="email" value={email}
                                      onChange={this.onChange} placeholder="Enter email"/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password"
                                      value={password}
                                      onChange={this.onChange} placeholder="Password"/>
                    </Form.Group>
                    <Button variant="primary" disabled={isInvalid} onClick={this.onSubmit} block><FontAwesomeIcon
                        icon={['fas', 'sign-in-alt']} size="1x" color="white"/> Sign In
                    </Button>
                    {error && <p>{error.message}</p>}
                </Form>
                <hr/>
            </div>
        );
    }
}

class SignInGoogleBase extends Component {
    constructor(props) {
        super(props);

        this.state = {error: null};
    }

    onSubmit = event => {
        this.props.firebase
            .doSignInWithGoogle()
            .then(socialAuthUser => {
                // Create a user in your Firebase Realtime Database too
                return this.props.firebase.user(socialAuthUser.user.uid).set({
                    username: socialAuthUser.user.displayName,
                    email: socialAuthUser.user.email,
                    roles: {},
                });
            })
            .then(() => {
                this.setState({error: null});
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }

                this.setState({error});
            });

        event.preventDefault();
    };

    render() {
        const {error} = this.state;

        return (

            <div onClick={this.onSubmit}>
                <Button variant="info" block> <FontAwesomeIcon icon={['fab', 'google']} size="1x" color="white"/> Sign
                    In with
                    Google</Button>
                {error && <p>{error.message}</p>}
            </div>
        );
    }
}

class SignInFacebookBase extends Component {
    constructor(props) {
        super(props);

        this.state = {error: null};
    }

    onSubmit = event => {
        this.props.firebase
            .doSignInWithFacebook()
            .then(socialAuthUser => {
                // Create a user in your Firebase Realtime Database too
                return this.props.firebase.user(socialAuthUser.user.uid).set({
                    username: socialAuthUser.additionalUserInfo.profile.name,
                    email: socialAuthUser.additionalUserInfo.profile.email,
                    roles: {},
                });
            })
            .then(() => {
                this.setState({error: null});
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }

                this.setState({error});
            });

        event.preventDefault();
    };

    render() {
        const {error} = this.state;

        return (
            <div onClick={this.onSubmit}>
                <Button variant="success" block> <FontAwesomeIcon icon={['fab', 'facebook']} size="1x"
                                                                  color="white"/> Sign In
                    with Facebook</Button>
                {error && <p>{error.message}</p>}
            </div>
        );
    }
}


const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFormBase);

const SignInGoogle = compose(
    withRouter,
    withFirebase,
)(SignInGoogleBase);

const SignInFacebook = compose(
    withRouter,
    withFirebase,
)(SignInFacebookBase);


export default SignInPage;

export {SignInForm, SignInGoogle, SignInFacebook};
