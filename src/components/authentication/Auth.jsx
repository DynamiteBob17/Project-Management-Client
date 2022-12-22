import { React, useState } from "react";
import { Container, Col, Row, Form, FloatingLabel, Button, ButtonGroup } from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";
import "./Auth.scss";
const cookies = new Cookies();

function Auth() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginForm, setLoginForm] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loginRequest = config => {
        axios(config)
            .then(result => {
                cookies.set('TOKEN', result.data.token, { path: '/' });
                cookies.set('USER_ID', result.data.user_id, { path: '/' });
                window.location.href = '/interface';
            })
            .catch(err => {
                setLoading(false);

                const message = err.response.data.message;
                setError(
                    typeof message !== 'undefined'
                        ? message
                        : 'Something went wrong'
                );
            });
    }

    const handleSubmit = e => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // username can't be in email format to prevent users accessing
        // someone else's account by entering their email address as username (even on accident)
        if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(username) && !loginForm) {
            setError('Invalid username');
            setLoading(false);
            return;
        }

        if (!loginForm) {
            const config = {
                method: 'POST',
                url: 'https://pm-restapi.onrender.com/api/register',
                data: {
                    email,
                    username,
                    password
                }
            }

            axios(config)
                .then(result => {
                    // login after registering
                    config.url = 'https://pm-restapi.onrender.com/api/login';
                    config.data = {
                        emailOrUsername: email,
                        password: password
                    }

                    loginRequest(config);
                })
                .catch(err => {
                    setLoading(false);

                    const detail = err.response.data.error.detail;
                    setError(
                        typeof detail !== 'undefined' && detail.includes('already exists')
                            ? 'Email or username already exists'
                            : 'Something went wrong'
                    );
                });
        } else {
            const config = {
                method: 'POST',
                url: 'https://pm-restapi.onrender.com/api/login',
                data: {
                    emailOrUsername,
                    password
                }
            }

            loginRequest(config);
        }
    }

    return (
        <div className="auth">
            <Container>
                <Row>
                    <Col>
                        <ButtonGroup>
                            <Button
                                className="switch"
                                variant="outline-info"
                                onClick={() => { setLoginForm(true); setError(null) }}
                                active={loginForm}
                                disabled={loading}
                            >
                                LOGIN
                            </Button>
                            <Button
                                className="switch"
                                variant="outline-info"
                                onClick={() => { setLoginForm(false); setError(null) }}
                                active={!loginForm}
                                disabled={loading}
                            >
                                REGISTER
                            </Button>
                        </ButtonGroup>

                        <Form onSubmit={handleSubmit}>
                            {
                                // only show the email input if the user is registering
                                !loginForm && (
                                    <FloatingLabel
                                        controlId="floatingEmail"
                                        label="Email"
                                    >
                                        <Form.Control
                                            required
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={e => { setEmail(e.target.value); setError(null) }}
                                        />
                                    </FloatingLabel>
                                )
                            }

                            {
                                // if the user is logging in, show the emailOrUsername input
                                // otherwise show the username input
                                loginForm
                                    ? (
                                        <FloatingLabel
                                            controlId="floatingEmailOrUsername"
                                            label="Email or username"
                                        >
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Email or username"
                                                value={emailOrUsername}
                                                onChange={e => { setEmailOrUsername(e.target.value); setError(null) }}
                                            />
                                        </FloatingLabel>

                                    )
                                    : (
                                        <FloatingLabel
                                            controlId="floatingUsername"
                                            label="Username"
                                        >
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Username"
                                                value={username}
                                                onChange={e => { setUsername(e.target.value); setError(null) }}
                                            />
                                        </FloatingLabel>
                                    )
                            }

                            <FloatingLabel
                                controlId="floatingPassword"
                                label="Password"
                            >
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(null) }}
                                />
                            </FloatingLabel>

                            {
                                loading
                                    ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                                    : <Button
                                        className="submit"
                                        variant="outline-info"
                                        type="submit"
                                        disabled={loading}
                                    >

                                        {loginForm ? 'Login' : 'Register'}
                                    </Button>
                            }

                            {error && <p className="auth-error">{error}</p>}
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Auth;
