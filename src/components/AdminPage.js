import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import './AdminPage.css';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/admin/users');
        if (response.data.data) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = async (userid) => {
    navigate(`/admin/users/${userid}/edit`);
  };

  const handleCreateUser = async () => {
    navigate(`/admin/users/create`);
  };

  return (
    <div>
      <Header />
      <div className='container user-list-container'>
        <h2>User List</h2>

        <button
          className='btn btn-primary create-user-button mt-2'
          onClick={handleCreateUser}
        >
          + Create User
        </button>

        <div className='table-responsive mt-5'>
          <table className='table table-bordered table-shadow'>
            <thead>
              <tr>
                <th className='bg-dark text-white'>Name</th>
                <th className='bg-dark text-white'>Email</th>
                <th className='bg-dark text-white'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? 'even-row' : 'odd-row'}
                >
                  <td>{user.username}</td>
                  <td>{user.useremail}</td>
                  <td className='d-flex justify-content-center'>
                    <button
                      className='btn btn-secondary edit-button'
                      onClick={() => handleEdit(user.userid)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
