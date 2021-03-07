import React, { useState, useEffect } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container, CircularProgress } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { GoogleLogin } from 'react-google-login';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import useStyles from './styles';
import Input from './Input';
import Icon from './icon';
import { signin, signup } from '../../actions/auth';

const inititalState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(inititalState);
    const dispatch = useDispatch();
    const history = useHistory();
    const [progress, setProgress] = useState(false);

    const isAuthRequestDone = useSelector((state) => state.authData);

    useEffect(() => {
        if (isAuthRequestDone) {
            setProgress(false);
        }
    }, [isAuthRequestDone]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignup) {
            dispatch(signup(formData, history));
        } else {
            dispatch(signin(formData, history));
        }

        setProgress(true);
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const switchMode = () => {
        setIsSignup((prevIsSignUp) => !prevIsSignUp);
        setShowPassword(false);
    }

    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;
        try {
            dispatch({ type: 'AUTH', data: { result, token } });
            history.push('/');
        } catch (error) {
            console.log(error);
        }
    }


    const googleFailure = (error) => {
        console.log("Google sign in was unsuccessful!");
        console.log(error);
    }
    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                {
                    progress ? <CircularProgress /> : (
                        <>
                            <Avatar className={classes.avatar}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography variant="h5">{isSignup ? 'Sign up' : 'Sign in'}</Typography>
                            <form className={classes.form} onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    {
                                        isSignup && (
                                            <>
                                                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus xs={6} />
                                                <Input name="lastName" label="Last Name" handleChange={handleChange} autoFocus xs={6} />
                                            </>
                                        )
                                    }
                                    <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                                    <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                                    {
                                        isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />
                                    }
                                </Grid>
                                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                                    {
                                        isSignup ? 'Sign up' : ' Sign in'
                                    }
                                </Button>
                                <GoogleLogin
                                    clientId="3591923537-6i92r2g22rg27qj1detaqotpfa45a7tq.apps.googleusercontent.com"
                                    render={(renderProps) => (
                                        <Button
                                            className={classes.googleButton}
                                            color="primary"
                                            fullWidth
                                            onClick={renderProps.onClick}
                                            disabled={renderProps.disabled}
                                            startIcon={<Icon />}
                                            variant="contained">
                                            Google
                                        </Button>
                                    )}
                                    onSuccess={googleSuccess}
                                    onFailure={googleFailure}
                                    cookiePolicy="single_host_origin"
                                />

                                <Grid container justify="flex-end">
                                    <Grid item>
                                        <Button onClick={switchMode}>
                                            {
                                                isSignup ? 'Already have an account? Sign in' : 'Sign up'
                                            }
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </>
                    )
                }
            </Paper>
        </Container>
    )
}

export default Auth