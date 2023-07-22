import React, { useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import './Header.css';
import axios from 'axios';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
axios.defaults.withCredentials = true;

export default function Header() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    async function checkAdmin() {
      try {
        const response = await axios.get('/checkgroup');
        if (response.data.data === 1)
          appDispatch({ type: 'isAdmin', value: true });
        if (response.data.data === 0)
          appDispatch({ type: 'isAdmin', value: false });
      } catch (error) {
        console.log(`could not fetch data`, error); //********need to handle this */
      }
    }
    checkAdmin();
    localStorage.setItem('pageRefreshed', 'true');
    return () => {
      ourRequest.cancel();
      localStorage.removeItem('pageRefreshed');
    };
  }, [appState.loggedIn, appState.user]);

  const handleSignOut = async () => {
    try {
      const response = await axios.get('/logout');
      if (response.data.success) {
        appDispatch({ type: 'logout' });
        appDispatch({ type: 'flashMessage', value: 'Successfully logged Out' });
        navigate('/');
      }
    } catch (error) {
      console.log(error);
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
      <div className='container'>
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
                onClick={handleSignOut}
              >
                <i className='fas fa-sign-out-alt'></i> Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
