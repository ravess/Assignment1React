import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';

export default function CreateGroupForm() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const [createGroup, setCreateGroup] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    async function fetchResults() {
      try {
        const response = await axios.get('/user/profile');
        if (response.data.data[0]) {
          appDispatch({ type: 'isAuth', data: response.data.data[0] });
        }
      } catch (error) {
        console.log(error);
      }
    }
    async function fetchGroup() {
      try {
        await axios.get('/admin/groups');
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
    }

    fetchResults();
    fetchGroup();
    return () => ourRequest.cancel();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/admin/groups/create', {
        usergroup: createGroup,
      });
      if (response.data)
        appDispatch({ type: 'flashMessage', value: 'Group created' });
      setCreateGroup('');
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

  return (
    <>
      {appState.user.userisAdmin ? (
        <div>
          <div className='container d-flex flex-column mt-3 border border-dark rounded w-50'>
            <h2>Create Group</h2>
            <form className='form-group' onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label htmlFor='username' className='form-label'>
                  Groupname
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='usergroup'
                  value={createGroup}
                  onChange={(e) => {
                    if (e.target.value.length < 0) {
                      setHasError(true);
                    } else {
                      setCreateGroup(e.target.value.trim());
                      setHasError(false);
                    }
                  }}
                  required
                  autoFocus
                />
              </div>

              <div className='d-flex justify-content-center'>
                <button
                  type='submit'
                  className='btn btn-dark d-flex ml-0 justify-content-center'
                  disabled={hasError}
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
