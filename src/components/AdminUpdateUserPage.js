import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from './Header';
import DispatchContext from '../DispatchContext';
import { useImmerReducer } from 'use-immer';

export default function EditUserForm() {
  const appDispatch = useContext(DispatchContext);
  const { userid } = useParams();
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
    inCurrentGroup: {
      value: '',
    },
    selectedRoles: [],
    availableRoles: [],
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case 'fetchUserGroupData':
        draft.usergroups.data = action.data;
        return;
      case 'filterUserGroups':
        const inCurrentGroupArray = draft.inCurrentGroup.value.split(',');
        draft.usergroups.data = draft.usergroups.data.filter(
          (group) => !inCurrentGroupArray.includes(group)
        );
        return;
      case 'fetchUserData':
        draft.username.value = action.data.username;
        draft.useremail.value = action.data.useremail;
        draft.userisActive.value = action.data.userisActive;
        draft.inCurrentGroup.value = action.data.usergroup;

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
          console.log(`it is in password rules`);
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

  const handleCurrentRoleChange = (e) => {
    //This portions help to create an array when you select the option.value in the select so that we can use join method to become a string like
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    const joinedSelectedOptions = selectedOptions.join(',');
    dispatch({ type: 'selectedUsergroups', value: joinedSelectedOptions });
  };

  const handleAddRole = () => {
    //Handle AddRole from here
  };

  const handleRemoveRole = () => {
    //Handle removeRole From here
  };

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      appDispatch({ type: 'loadingSpinning' });
      const response = await axios.put(`/admin/user/${userid}`, user);
      if (response.data.success) {
        appDispatch({ type: 'loadingSpinning' });
        console.log('User updated successfully');
      }
    } catch (error) {
      appDispatch({ type: 'loadingSpinning' });
      console.error('Error updating user:', error);
    }
  };
  const handleCheckboxChange = (e) => {
    dispatch({ type: 'userisActive', value: e.target.checked });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const requests = [
          axios.get(`/admin/user/${userid}`),
          axios.get(`/admin/groups`),
        ];
        const [response1, response2] = axios.all(requests);
        if (response1.data.data) {
          console.log(`fetching user data`);
          dispatch({ type: 'fetchUserData', data: response1.data.data });
        }
        if (response2.data.data) {
          console.log(`fetching group data`);
          dispatch({ type: 'fetchUserGroupData', data: response2.data.data });
        }
      } catch (error) {
        console.error('Error fetching users:', error.response);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <Header />
      <div className='container mt-4 p-3 border rounded border-secondary w-75'>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='username' className='form-label'>
              Username
            </label>
            <input
              type='text'
              className='form-control'
              id='username'
              name='username'
              // value={user.name}
              onChange={(e) =>
                dispatch({ type: 'usernameChange', value: e.target.value })
              }
              placeholder='I owe you 1 tower'
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
              name='password'
              // value={user.password}
              onChange={(e) => {
                dispatch({ type: 'userpasswordChange', value: e.target.value });
              }}
              placeholder='*********'
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>
              Email
            </label>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              // value={user.email}
              onChange={(e) => dispatch({ type: 'useremailChange' })}
            />
          </div>
          <div className='form-check mb-3'>
            <input
              className='form-check-input'
              type='checkbox'
              id='disabled'
              name='disabled'
              // checked={user.disabled}
              onChange={handleCheckboxChange}
            />
            <label className='form-check-label' htmlFor='disabled'>
              Disable User
            </label>
          </div>
          <div className='mb-3'>
            <label className='form-label'>Usergroup Roles</label>
            <div className='dual-listbox d-flex justify-content-space-between'>
              <select
                className='form-select'
                multiple
                value={state.selectedRoles}
                onChange={handleCurrentRoleChange}
              >
                {/* {usergroupOptions.map((group) => (
                  <option key={group.groupid} value={group.groupid}>
                    {group.groupname}
                  </option>
                ))} */}
                <option>testestfromleftaisojdoiasjd</option>
              </select>
              <div className='dual-listbox-controls d-flex flex-column mt-2'>
                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={handleAddRole}
                >
                  &gt;
                </button>
                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={handleRemoveRole}
                >
                  &lt;
                </button>
              </div>
              <select className='form-select' multiple>
                {/* {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))} */}
                <option>testtest</option>
              </select>
            </div>
          </div>
          <button type='submit' className='btn btn-primary'>
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

// const handleChange = (e) => {
//   setUser({ ...user, [e.target.name]: e.target.value });
// };

// const handleRoleSelection = (e) => {
//   const selectedOptions = Array.from(e.target.selectedOptions).map((option) =>
//     parseInt(option.value)
//   );
//   setSelectedRoles(selectedOptions);
// };

// const handleAddRole = () => {
//   const updatedSelectedRoles = [...selectedRoles];
//   const updatedAvailableRoles = [...availableRoles];
//   selectedRoles.forEach((role) => {
//     const index = updatedAvailableRoles.indexOf(role);
//     updatedAvailableRoles.splice(index, 1);
//   });
//   setUser({ ...user, usergroupRoles: updatedSelectedRoles });
//   setSelectedRoles(updatedSelectedRoles);
//   setAvailableRoles(updatedAvailableRoles);
// };

// const handleRemoveRole = () => {
//   const updatedSelectedRoles = [...selectedRoles];
//   const updatedAvailableRoles = [...availableRoles];
//   availableRoles.forEach((role) => {
//     const index = updatedSelectedRoles.indexOf(role);
//     updatedSelectedRoles.splice(index, 1);
//   });
//   setUser({ ...user, usergroupRoles: updatedSelectedRoles });
//   setSelectedRoles(updatedSelectedRoles);
//   setAvailableRoles(updatedAvailableRoles);
// };

// const handleAddRole = () => {
//   const selectedOptions = Array.from(
//     document.getElementById('availableRoles').selectedOptions,
//     (option) => option.value
//   );
//   const newRoles = selectedOptions.filter(
//     (role) => !state.inCurrentGroup.value.includes(role)
//   );
//   const updatedGroup = [
//     ...state.inCurrentGroup.value.split(','),
//     ...newRoles,
//   ].join(',');
//   dispatch({ type: 'selectedUsergroups', value: updatedGroup });
// };

// const handleRemoveRole = () => {
//   const selectedOptions = Array.from(
//     document.getElementById('inCurrentGroup').selectedOptions,
//     (option) => option.value
//   );
//   const rolesToRemove = selectedOptions.map((option) => option.value);
//   const updatedGroup = state.inCurrentGroup.value
//     .split(',')
//     .filter((role) => !rolesToRemove.includes(role))
//     .join(',');
//   dispatch({ type: 'selectedUsergroups', value: updatedGroup });
// };
