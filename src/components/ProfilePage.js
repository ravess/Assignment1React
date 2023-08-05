import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

export default function ProfilePage() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const isFormDisabled = (email === '' && password === '') || passwordError;

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    async function fetchResults() {
      try {
        const response = await axios.get('/user/profile');
        if (response.data.data[0]) {
          appDispatch({ type: 'isAuth', data: response.data.data[0] });
        }
      } catch (error) {
        if (error.response && error.response.data.error.statusCode === 401) {
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
          navigate('/user/dashboard');
        }
        if (error.response && error.response.data.error.statusCode === 403) {
          appDispatch({ type: 'logout' });
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
          navigate('/');
        }
        if (error.response && error.response.data)
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
      }
    }
    fetchResults();
    return () => ourRequest.cancel();
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordOnBlur = (e) => {
    try {
      const rePassword = new RegExp(
        '^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,10}$'
      );
      if (
        e.target.value.length < 0 ||
        (!rePassword.test(e.target.value) && e.target.value)
      ) {
        setPasswordError(true);
        setPasswordMessage(
          'You need to provide min8 and max10 length with special char'
        );
      } else {
        setPasswordError(false);
        setPasswordMessage('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { useremail: email, userpassword: password };
    try {
      // Make a POST request to your backend API to update the email and password
      const response = await axios.put('/user/profile/edit', user);
      if (response.data) {
        appDispatch({ type: 'flashMessage', value: 'User updated!' });
        navigate('/user/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.error.statusCode === 401) {
        appDispatch({
          type: 'flashMessageErr',
          value: error.response.data.errMessage,
        });
        navigate('/user/dashboard');
      }
      if (error.response && error.response.data.error.statusCode === 403) {
        appDispatch({ type: 'logout' });
        appDispatch({
          type: 'flashMessageErr',
          value: error.response.data.errMessage,
        });
        navigate('/');
      }
      if (error.response && error.response.data)
        appDispatch({
          type: 'flashMessageErr',
          value: error.response.data.errMessage,
        });
    }
  };

  return (
    <>
      {appState.loggedIn ? (
        <div className='container '>
          <div className='container justify-content-center w-50 mt-5'>
            <div className='profile-card card p-3 border border-dark .bg-light'>
              <h1 className='card-title'>Profile</h1>
              <form onSubmit={handleSubmit}>
                <div className='form-group'>
                  <label htmlFor='username'>Username:</label>
                  <input
                    type='text'
                    className='form-control'
                    id='username'
                    value={appState.user.username}
                    disabled
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='email'>Email:</label>
                  <input
                    type='email'
                    className='form-control'
                    id='email'
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='password'>Password:</label>
                  <input
                    type='password'
                    className='form-control'
                    id='password'
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordOnBlur}
                  />
                  {passwordError && (
                    <div className='alert alert-danger small liveValidateMessage'>
                      {passwordMessage}
                    </div>
                  )}
                </div>
                <button
                  type='submit'
                  className='btn btn-dark btn-block ml-0 mt-3'
                  disabled={isFormDisabled}
                >
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
