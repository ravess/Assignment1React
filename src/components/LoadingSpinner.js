import React from 'react';
import '../styles/styles.css';

const LoadingSpinner = () => {
  return (
    <div className='loading-spinner-overlay'>
      <div className='loading-spinner'></div>
    </div>
  );
};

export default LoadingSpinner;
