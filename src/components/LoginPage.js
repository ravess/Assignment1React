import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.baseURL = process.env.BACKENDURL;
axios.defaults.withCredentials = true;

import './LoginPage.css';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [userpassword, setUserpassword] = useState('');
  const [isloggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        '/login',
        { username, userpassword },
        { withCredentials: true }
      );
      setIsLoading(false);
      console.log(response.data);
      console.log('Logging in...');
    } catch (error) {
      console.log('Login Failed', error);
    }
  };

  return (
    <div className='container'>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className='card'>
          <div className='card-body'>
            <h5 className='card-title'>Login</h5>
            <form onSubmit={handleLogin}>
              <div className='form-group'>
                <label htmlFor='username'>Username</label>
                <input
                  type='text'
                  className='form-control'
                  id='username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='userpassword'>userpassword</label>
                <input
                  type='password'
                  className='form-control'
                  id='userpassword'
                  value={userpassword}
                  onChange={(e) => setUserpassword(e.target.value)}
                  required
                />
              </div>
              <button type='submit'>Login</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
