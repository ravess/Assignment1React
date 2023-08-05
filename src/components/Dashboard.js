import React, { useContext, useEffect } from 'react';
import './Dashboard.css'; // Import your custom CSS file
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
  };
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    const fetchResults = async () => {
      try {
        const response = await axios.get('/user/profile');
        if (response.data.data[0]) {
          appDispatch({ type: 'isAuth', data: response.data.data[0] });
        }
      } catch (error) {
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
    fetchResults();
    return () => ourRequest.cancel();
  }, []);

  return (
    <>
      {appState.loggedIn ? (
        <div>
          <div className='dashboard'>
            <div className='container'>
              <h5 className='dashboard__title text-center mt-5'>
                Welcome, {appState.user.username}!
              </h5>
              <p className='dashboard__description text-center'>
                This is your dashboard. Enjoy your stay.
              </p>
            </div>
          </div>
          <div className='container-fluid row justify-content-center d-inline-flex mt-5 mx-auto'>
            <Link
              to={'/user/profile'}
              className='col-md-4 mb-4'
              style={linkStyle}
            >
              <div className='card m-auto h-100'>
                <div className='card-body bg-dark'>
                  <h5 className='card-title text-white text-center'>
                    Profile:
                  </h5>
                  <p className='card-title text-white'>
                    Username: {appState.user.username}
                  </p>
                  <p className='card-title text-white'>
                    Email: {appState.user.useremail}
                  </p>
                  <p className='card-title text-white'>
                    Status:{appState.user.userisActive ? '🟢' : '🔴'}
                  </p>
                </div>
              </div>
            </Link>
            <Link to={'/apps'} className='col-md-4 mb-4' style={linkStyle}>
              <div className='card m-auto h-100'>
                <div className='card-body bg-dark'>
                  <h5 className='card-title text-white text-center'>
                    View All Apps
                  </h5>
                  <p className='card-title text-white'>Number of Apps: </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        navigate('/')
      )}
    </>
  );
}
