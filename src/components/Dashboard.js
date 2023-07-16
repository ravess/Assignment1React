import React from 'react';
import Header from './Header';
import './Dashboard.css'; // Import your custom CSS file

export default function Dashboard({ username }) {
  return (
    <div>
      <Header />
      <div className='dashboard'>
        <div className='container'>
          <h5 className='dashboard__title'>Welcome, {username}!</h5>
          <p className='dashboard__description'>
            This is your dashboard. Enjoy your stay.
          </p>

          {/* Add more dashboard content here */}
        </div>
      </div>
    </div>
  );
}
