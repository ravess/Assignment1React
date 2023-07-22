import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import axios from 'axios';
axios.defaults.baseURL = process.env.BACKENDURL;
axios.defaults.withCredentials = true;

export default function HomePage() {
  const appDispatch = useContext(DispatchContext);
  const [username, setUsername] = useState('');
  const [userpassword, setUserpassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { username, userpassword });
      if (response.data.success === true) {
        appDispatch({ type: 'login' });
        appDispatch({
          type: 'flashMessage',
          value: "You've logged in Succssfully!",
        });
        navigate('/user/dashboard');
      }
    } catch (error) {
      if (error.response.data) {
        appDispatch({
          type: 'flashMessageErr',
          value: error.response.data.errMessage,
        });
      }
    }
  };

  return (
    <div className='d-flex mt-5'>
      <div className='container w-50 d-flex justify-content-center align-content mt-5'>
        <div className='card w-50 d-flex align-items-center border border-dark bg-light'>
          <div className='card-body justify-content-center'>
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
                <label htmlFor='userpassword'>Password</label>
                <input
                  type='password'
                  className='form-control'
                  id='userpassword'
                  value={userpassword}
                  onChange={(e) => setUserpassword(e.target.value)}
                  required
                />
              </div>
              <button
                type='submit'
                className='btn btn-outline-dark btn-block ml-0'
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
