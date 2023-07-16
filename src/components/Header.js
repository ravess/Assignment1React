import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import axios from 'axios';
axios.defaults.withCredentials = true;

export default function Header() {
  const username = 'John Doe';
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await axios.post('/logout');
    navigate('/');
  };

  const createUser = () => {
    console.log('Create User...');
  };

  const viewAccount = () => {
    console.log('View Account...');
  };

  return (
    <nav className='navbar'>
      <div className='navbar-content'>
        <Link to='/user/dashboard' className='brand'>
          Homepage
        </Link>
        <div className='navbar-items'>
          <span className='welcome-message'>Welcome, {username}</span>
          <div className='button-container'>
            <Link to='/admin/users'>
              <button className='create-button' onClick={createUser}>
                <i className='fas fa-users'></i> Users
              </button>
            </Link>
            <Link to='/user/profile'>
              <button className='view-account' onClick={viewAccount}>
                <i className='fas fa-user'></i> My Profile
              </button>
            </Link>
            <Link to='/'>
              <button className='sign-out-button' onClick={handleSignOut}>
                <i className='fas fa-sign-out-alt'></i> Sign Out
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
