import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Update loading state to false after 2000 milliseconds
    }, 2000);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Perform login logic here
    // You can use the username and password state values
    console.log('Logging in...');
  };

  return (
    <div
      className='container d-flex justify-content-center align-items-center'
      style={{ minHeight: '100vh' }}
    >
      {isLoading ? ( // Check if loading state is true
        <LoadingSpinner /> // Display the loading spinner component
      ) : (
        <div className='card' style={{ width: '40%' }}>
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
                <label htmlFor='password'>Password</label>
                <input
                  type='password'
                  className='form-control'
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type='submit' className='btn btn-primary'>
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
