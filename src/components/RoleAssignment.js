import React, { useEffect, useReducer } from 'react';
import produce from 'immer';

const initialState = {
  availableRoles: [],
  currentRoles: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_AVAILABLE_ROLES':
      return produce(state, (draft) => {
        draft.availableRoles = action.payload;
      });

    case 'SET_CURRENT_ROLES':
      return produce(state, (draft) => {
        draft.currentRoles = action.payload;
      });

    case 'MOVE_TO_CURRENT':
      return produce(state, (draft) => {
        draft.currentRoles.push(...action.payload);
        draft.availableRoles = draft.availableRoles.filter(
          (role) => !action.payload.includes(role)
        );
      });

    case 'MOVE_TO_AVAILABLE':
      return produce(state, (draft) => {
        draft.availableRoles.push(...action.payload);
        draft.currentRoles = draft.currentRoles.filter(
          (role) => !action.payload.includes(role)
        );
      });

    default:
      return state;
  }
};

const RoleAssignmentForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchAvailableRoles();
    fetchCurrentUserRoles();
  }, []);

  const fetchAvailableRoles = () => {
    // Make a GET request to the backend API endpoint for available roles
    fetch('/api/roles/available')
      .then((response) => response.json())
      .then((data) => dispatch({ type: 'SET_AVAILABLE_ROLES', payload: data }))
      .catch((error) => console.log(error));
  };

  const fetchCurrentUserRoles = () => {
    // Make a GET request to the backend API endpoint for current user roles
    fetch('/api/roles/current')
      .then((response) => response.json())
      .then((data) => dispatch({ type: 'SET_CURRENT_ROLES', payload: data }))
      .catch((error) => console.log(error));
  };

  const moveRolesToCurrent = () => {
    const selectedOptions = Array.from(
      document.querySelectorAll('#availableRoles option:checked')
    );
    const selectedRoleIds = selectedOptions.map((option) => option.value);
    dispatch({ type: 'MOVE_TO_CURRENT', payload: selectedRoleIds });
  };

  const moveRolesToAvailable = () => {
    const selectedOptions = Array.from(
      document.querySelectorAll('#currentRoles option:checked')
    );
    const selectedRoleIds = selectedOptions.map((option) => option.value);
    dispatch({ type: 'MOVE_TO_AVAILABLE', payload: selectedRoleIds });
  };

  return (
    <div>
      <h2>Roles Assignment</h2>
      <div className='container'>
        <div className='column'>
          <h3>Available Roles</h3>
          <select id='availableRoles' multiple>
            {state.availableRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button onClick={moveRolesToCurrent} className='arrow'>
            &rarr;
          </button>
          <button onClick={moveRolesToAvailable} className='arrow'>
            &larr;
          </button>
        </div>

        <div className='column'>
          <h3>Current User Roles</h3>
          <select id='currentRoles' multiple>
            {state.currentRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default RoleAssignmentForm;
