import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminPage.css';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import CreateGroupForm from './CreateGroupPage';

export default function UserList() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/admin/users');
        if (response.data.data) {
          setUsers(response.data.data);
        }
      } catch (error) {
        if (error.response.data.error.statusCode === 403) {
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
          navigate('/user/dashboard');
        }
        if (error.response.data)
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
      }
    };
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/user/profile');
        if (response.data.data[0]) {
          appDispatch({ type: 'isAuth', data: response.data.data[0] });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
    fetchUsers();
    return () => ourRequest.cancel();
  }, []);

  const handleEdit = (userid) => {
    navigate(`/admin/users/${userid}/edit`);
  };

  const handleCreateUser = () => {
    navigate(`/admin/users/create`);
  };

  const handleCreateGroup = () => {
    navigate(`/admin/groups/create`);
  };

  return (
    <>
      {appState.user.userisAdmin ? (
        <div className='bg-light'>
          <div className='container'>
            <h2 className='text-center mt-5'>User List</h2>
            <div className='container d-flex justify-content-center'>
              <button
                className='btn btn-outline-dark mt-2 mr-2'
                onClick={handleCreateUser}
              >
                <i class='fas fa-plus'></i> Create User
              </button>

              <button
                className='btn btn-outline-dark mt-2 ml-2'
                onClick={handleCreateGroup}
              >
                <i class='fas fa-plus'></i> Create Group
              </button>
            </div>

            <div className='table-responsive mt-5'>
              <table className='table table-bordered table-shadow'>
                <thead>
                  <tr>
                    <th className='bg-dark text-white'>Name</th>
                    <th className='bg-dark text-white'>Email</th>
                    <th className='bg-dark text-white'>Groups</th>
                    <th className='bg-dark text-white'>Status</th>
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
                      <td>{user.usergroup}</td>
                      <td>{user.userisActive ? '🟢' : '🔴'}</td>
                      <td className='d-flex justify-content-center'>
                        <button
                          className='btn btn-secondary'
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
          <div className='container'>{/* <CreateGroupForm /> */}</div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
