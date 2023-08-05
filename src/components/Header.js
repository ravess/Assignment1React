import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
axios.defaults.baseURL = process.env.BACKENDURL;
axios.defaults.withCredentials = true;

export default function Header() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    async function checkRole() {
      try {
        const responseAdmin = await axios.post('/checkgroup', {
          usergroup: 'admin',
        });
        if (responseAdmin.data.data === 1) {
          appDispatch({ type: 'isAdmin', value: true });
        }
        if (responseAdmin.data.data === 0) {
          appDispatch({ type: 'isAdmin', value: false });
        }
      } catch (error) {
        console.log(error);
      }
      try {
        const responsePl = await axios.post('/checkgroup', {
          usergroup: 'pl',
        });
        if (responsePl.data.data === 1) {
          appDispatch({ type: 'isPl', value: true });
        }
        if (responsePl.data.data === 0) {
          appDispatch({ type: 'isPl', value: false });
        }
      } catch (error) {
        console.log(error);
      }
      try {
        const responsePm = await axios.post('/checkgroup', {
          usergroup: 'pm',
        });
        if (responsePm.data.data === 1) {
          appDispatch({ type: 'isPm', value: true });
        }
        if (responsePm.data.data === 0) {
          appDispatch({ type: 'isPm', value: false });
        }
      } catch (error) {
        console.log(error);
      }
    }
    checkRole();
    return () => {
      ourRequest.cancel();
    };
  }, [appState.loggedIn, appState.user]);

  const handleLogOut = async () => {
    try {
      const response = await axios.get('/logout');
      if (response.data.success) {
        appDispatch({ type: 'logout' });
        appDispatch({ type: 'flashMessage', value: 'Successfully logged Out' });
        navigate('/');
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

  const getAllUser = () => {
    navigate('/admin/users');
  };

  const viewAccount = () => {
    navigate('/user/profile');
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
      <Link to='/user/dashboard' className='navbar-brand'>
        TMS
      </Link>
      <div className='navbar-collapse'>
        <ul className='navbar-nav ml-auto'>
          <li className='nav-item'>
            <span className='navbar-text mr-3'>
              Welcome, {appState.user.username}
            </span>
          </li>
          {appState.user.userisAdmin && (
            <li className='nav-item'>
              <button
                className='btn btn-link text-white text-decoration-none'
                onClick={getAllUser}
              >
                <i className='fas fa-users'></i> Users
              </button>
            </li>
          )}
          <li className='nav-item'>
            <button
              className='btn btn-link text-white text-decoration-none'
              onClick={viewAccount}
            >
              <i className='fas fa-user'></i> My Profile
            </button>
          </li>
          <li className='nav-item'>
            <button
              className='btn btn-link text-white text-decoration-none'
              onClick={handleLogOut}
            >
              <i className='fas fa-sign-out-alt'></i> Sign Out
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
