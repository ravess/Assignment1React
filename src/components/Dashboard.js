import React, { useContext, useEffect } from 'react';
import Header from './Header';
import './Dashboard.css'; // Import your custom CSS file
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import axios from 'axios';

export default function Dashboard() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    async function fetchResults() {
      try {
        const response = await axios.get('/user/profile');

        if (response.data.data[0]) {
          appDispatch({ type: 'dashboardPage', data: response.data.data[0] });
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchResults();
    return () => ourRequest.cancel();
  }, []);

  return (
    <>
      <div>
        <Header />
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
        <div className='container d-flex justify-content-center mt-5'></div>
        <div className='card w-25 d-flex m-auto'>
          <div className='card-body bg-dark'>
            <h5 className='card-title text-white text-center'>Profile:</h5>
            <h4 className='card-title text-white'>
              Username: {appState.user.username}
            </h4>
            <h4 className='card-title text-white'>
              Email: {appState.user.useremail}
            </h4>
            <h4 className='card-title text-white'>
              Status:{appState.user.userisActive ? '🟢' : '🔴'}
            </h4>
          </div>
        </div>
      </div>
    </>
  );
}
