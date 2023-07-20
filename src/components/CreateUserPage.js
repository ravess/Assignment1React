import React, { useState, useEffect, useContext } from 'react';
import { useImmerReducer } from 'use-immer';
import Header from './Header';
import axios from 'axios';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import LoadingSpinner from './LoadingSpinner';

export default function CreateUserForm() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const originalState = {
    username: {
      value: '',
      hasErrors: false,
      message: '',
    },
    userpassword: {
      value: '',
      hasErrors: false,
      message: '',
    },
    useremail: {
      value: '',
    },
    userisActive: {
      value: true,
      hasErrors: false,
      message: '',
    },
    usergroups: {
      data: [],
    },
    selectedUsergroups: {
      value: '',
    },
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case 'fetchUserGroup':
        draft.usergroups.data = action.data;
        return;

      case 'usernameChange':
        draft.username.hasErrors = false;
        draft.username.value = action.value;
        return;
      case 'userpasswordChange':
        draft.userpassword.hasErrors = false;
        draft.userpassword.value = action.value;
        return;

      case 'useremailChange':
        draft.useremail.value = action.value;
        return;

      case 'userisActive':
        draft.userisActive.hasErrors = false;
        draft.userisActive.value = action.value;
        return;
      case 'selectedUsergroups':
        draft.selectedUsergroups.hasErrors = false;
        draft.selectedUsergroups.value = action.value;

        return;
      case 'usernameRules':
        if (!action.value.trim()) {
          draft.username.hasErrors = true;
          draft.username.message = 'You must provide a username';
        }
        return;
      case 'userpasswordRules':
        const rePassword = new RegExp(
          '^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,10}$'
        );
        if (
          !action.value.trim() ||
          (!rePassword.test(action.value) && action.value)
        ) {
          draft.userpassword.hasErrors = true;
          draft.userpassword.message =
            'Your Password is required and alphanumeric min8 chars, max10chars with special chars.';
        } else {
          draft.userpassword.hasErrors = false;
        }
        return;

      case 'submitRequest':
        if (!draft.username.hasErrors && !draft.userpassword.hasErrors) {
          (draft.username.value = ''),
            (draft.userpassword.value = ''),
            (draft.selectedUsergroups.value = ''),
            (draft.useremail.value = ''),
            (draft.userisActive.value = true);
        }
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  useEffect(() => {
    const fetchUsergroups = async () => {
      try {
        const response = await axios.get('/admin/groups');
        if (response.data) {
          dispatch({ type: 'fetchUserGroup', data: response.data.data });
        }
      } catch (error) {
        console.error('Error fetching usergroups:', error);
      }
    };

    fetchUsergroups();
  }, []);

  const handleCheckboxChange = (e) => {
    dispatch({ type: 'userisActive', value: e.target.checked });
  };

  const handleSelectChange = (e) => {
    console.log(e.target.selectedOptions);
    //This portions help to create an array when you select the option.value in the select so that we can use join method to become a string like
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    const joinedSelectedOptions = selectedOptions.join(',');
    dispatch({ type: 'selectedUsergroups', value: joinedSelectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      appDispatch({ type: 'loadingSpinning' });
      const response = await axios.post('/admin/users/create', {
        username: state.username.value,
        userpassword: state.userpassword.value,
        useremail: state.useremail.value,
        userisActive: state.userisActive.value,
        usergroup: state.selectedUsergroups.value,
      });
      if (response.data) {
        dispatch({ type: 'submitRequest' });
        appDispatch({ type: 'loadingSpinning' });
        console.log(state.selectedUsergroups.value, `after response came back`);
        console.log(response.data.data);
      }
    } catch (error) {
      appDispatch({ type: 'loadingSpinning' });
      console.log(error.response.data.errMessage);
    }
  };

  return (
    <div>
      {appState.isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className='container d-flex flex-column mt-3 border border-dark rounded w-50'>
          <h2>Create User</h2>
          {console.log(appState.user)}
          <form className='form-group' onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor='username' className='form-label'>
                Username
              </label>
              <input
                type='text'
                className='form-control'
                id='username'
                value={state.username.value}
                onChange={(e) =>
                  dispatch({ type: 'usernameChange', value: e.target.value })
                }
                required
                autoFocus
                onBlur={(e) =>
                  dispatch({ type: 'usernameRules', value: e.target.value })
                }
              />
              {state.username.hasErrors && (
                <div className='alert alert-danger small liveValidateMessage'>
                  {state.username.message}
                </div>
              )}
            </div>
            <div className='mb-3'>
              <label htmlFor='password' className='form-label'>
                Password
              </label>
              <input
                type='password'
                className='form-control'
                id='password'
                value={state.userpassword.value}
                onChange={(e) =>
                  dispatch({
                    type: 'userpasswordChange',
                    value: e.target.value,
                  })
                }
                onBlur={(e) =>
                  dispatch({ type: 'userpasswordRules', value: e.target.value })
                }
                required
              />
              {state.userpassword.hasErrors && (
                <div className='alert alert-danger small liveValidateMessage'>
                  {state.userpassword.message}
                </div>
              )}
            </div>
            <div className='mb-3'>
              <label htmlFor='useremail' className='form-label'>
                Useremail
              </label>
              <input
                type='email'
                className='form-control'
                id='useremail'
                value={state.useremail.value}
                onChange={(e) =>
                  dispatch({ type: 'useremailChange', value: e.target.value })
                }
              />
            </div>
            <div className='mb-3 form-check'>
              <input
                className='form-check-input'
                type='checkbox'
                id='isActive'
                checked={state.userisActive.value}
                onChange={handleCheckboxChange}
              />
              <label className='form-check-label' htmlFor='isActive'>
                Active
              </label>
            </div>
            <div className='mb-3 d-flex flex-column'>
              <label htmlFor='usergroups' className='form-label'>
                Usergroups
              </label>
              <select
                multiple
                className='form-select'
                id='usergroups'
                onChange={handleSelectChange}
              >
                {state.usergroups.data.map((group) => {
                  return (
                    <option key={group.groupid} value={group.groupname}>
                      {group.groupname}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className='d-flex justify-content-center'>
              <button
                type='submit'
                className='btn btn-dark d-flex ml-0 justify-content-center'
                disabled={
                  state.username.hasErrors ||
                  state.userpassword.hasErrors ||
                  !state.username.value.trim() ||
                  !state.userpassword.value.trim()
                }
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
