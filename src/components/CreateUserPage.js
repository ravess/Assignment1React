import React, { useState, useEffect } from 'react';
import Header from './Header';
import axios from 'axios';

export default function CreateUserForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [useremail, setUseremail] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [usergroups, setUsergroups] = useState([]);
  const [selectedUsergroups, setSelectedUsergroups] = useState([]);

  useEffect(() => {
    const fetchUsergroups = async () => {
      try {
        const response = await axios.get('/admin/groups');
        if (response.data) {
          setUsergroups(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching usergroups:', error);
      }
    };

    fetchUsergroups();
  }, []);

  const handleCheckboxChange = (e) => {
    setIsActive(e.target.checked);
  };

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedUsergroups(selectedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form submission and user creation logic here
    console.log('Form submitted');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Useremail:', useremail);
    console.log('Is Active:', isActive);
    console.log('Selected Usergroups:', selectedUsergroups);
  };

  return (
    <div>
      <Header />
      <div className='container'>
        <h2>Create User</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='username' className='form-label'>
              Username
            </label>
            <input
              type='text'
              className='form-control'
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>
              Password
            </label>
            <input
              type='password'
              className='form-control'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='useremail' className='form-label'>
              Useremail
            </label>
            <input
              type='email'
              className='form-control'
              id='useremail'
              value={useremail}
              onChange={(e) => setUseremail(e.target.value)}
              required
            />
          </div>
          <div className='mb-3 form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              id='isActive'
              checked={isActive}
              onChange={handleCheckboxChange}
            />
            <label className='form-check-label' htmlFor='isActive'>
              Active
            </label>
          </div>
          <div className='mb-3'>
            <label htmlFor='usergroups' className='form-label'>
              Usergroups
            </label>
            <select
              multiple
              className='form-select'
              id='usergroups'
              value={selectedUsergroups}
              onChange={handleSelectChange}
            >
              {usergroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <button type='submit' className='btn btn-primary'>
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}
