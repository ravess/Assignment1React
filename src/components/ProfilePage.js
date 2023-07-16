import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import './ProfilePage.css';

export default function ProfilePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your backend API to update the email and password
      const response = await axios.post('/api/updateProfile', {
        email,
        password,
      });

      if (response.status === 200) {
        setMessage('Profile updated successfully.');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage('An error occurred while updating the profile.');
    }
  };

  return (
    <div>
      <Header />
      <div className='container'>
        <div className='profile-card'>
          <h1>Profile</h1>
          <form onSubmit={handleSubmit}>
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
              />
            </div>
            <button type='submit' className='btn-primary'>
              Update Profile
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
}
