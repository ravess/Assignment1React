// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import Header from './Header';
// import DispatchContext from '../DispatchContext';

// export default function EditUserForm() {
//   const appDispatch = useContext(DispatchContext);
//   const { userid } = useParams();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isActive, setIsActive] = useState(false);
//   const [groups, setGroups] = useState('');
//   const [usergroupOptions, setUsergroupOptions] = useState([]);

//   useEffect(() => {
//     const fetchUserAndUsergroup = async () => {
//       try {
//         appDispatch({ type: 'loadingSpinning' });

//         const userResponse = axios.get(`/admin/user/${userid}`);
//         const usergroupResponse = axios.get(`/admin/groups`);

//         const [userResult, usergroupResult] = await axios.all([
//           userResponse,
//           usergroupResponse,
//         ]);

//         if (userResult.data.data && usergroupResult.data.data) {
//           const userData = userResult.data.data[0];
//           appDispatch({ type: 'loadingSpinning' });
//           setName(userData.username);
//           setEmail(userData.useremail);
//           // Set other user data fields here

//           const usergroupData = usergroupResult.data.data;
//           setUsergroupOptions(usergroupData);
//         }
//       } catch (error) {
//         appDispatch({ type: 'loadingSpinning' });
//         console.error('Error fetching user and usergroup:', error);
//       }
//     };

//     fetchUserAndUsergroup();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       appDispatch({ type: 'loadingSpinning' });
//       const response = await axios.put(`/admin/user/${userid}`, {
//         username: name,
//         useremail: email,
//         userpassword: password,
//         userisactive: isActive,
//         groups: groups,
//       });
//       if (response.data.success) {
//         appDispatch({ type: 'loadingSpinning' });
//         console.log('User updated successfully');
//       }
//     } catch (error) {
//       appDispatch({ type: 'loadingSpinning' });
//       console.error('Error updating user:', error);
//     }
//   };

//   return (
//     <div>
//       <Header />
//       <div className='container mt-4'>
//         <form onSubmit={handleSubmit}>
//           <div className='mb-3'>
//             <label htmlFor='username' className='form-label'>
//               Username
//             </label>
//             <input
//               type='text'
//               className='form-control'
//               id='username'
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='email' className='form-label'>
//               Email
//             </label>
//             <input
//               type='email'
//               className='form-control'
//               id='email'
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='password' className='form-label'>
//               Password
//             </label>
//             <input
//               type='password'
//               className='form-control'
//               id='password'
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <div className='form-check mb-3'>
//             <input
//               className='form-check-input'
//               type='checkbox'
//               id='isActive'
//               checked={isActive}
//               onChange={(e) => setIsActive(e.target.checked)}
//             />
//             <label className='form-check-label' htmlFor='isActive'>
//               Active
//             </label>
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='groups' className='form-label'>
//               Groups
//             </label>
//             <select
//               className='form-select'
//               id='groups'
//               value={groups}
//               onChange={(e) => setGroups(e.target.value)}
//             >
//               <option value=''>Select a group</option>
//               {usergroupOptions.map((group) => (
//                 <option key={group.id} value={group.name}>
//                   {group.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <button type='submit' className='btn btn-primary'>
//             Update
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from './Header';
import DispatchContext from '../DispatchContext';

export default function EditUserForm() {
  const appDispatch = useContext(DispatchContext);
  const { userid } = useParams();
  const [user, setUser] = useState({
    username: '',
    password: '',
    email: '',
    disabled: false,
    usergroupRoles: [],
  });
  const [usergroupOptions, setUsergroupOptions] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRoleSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) =>
      parseInt(option.value)
    );
    setSelectedRoles(selectedOptions);
  };

  const handleAddRole = () => {
    const updatedSelectedRoles = [...selectedRoles];
    const updatedAvailableRoles = [...availableRoles];
    selectedRoles.forEach((role) => {
      const index = updatedAvailableRoles.indexOf(role);
      updatedAvailableRoles.splice(index, 1);
    });
    setUser({ ...user, usergroupRoles: updatedSelectedRoles });
    setSelectedRoles(updatedSelectedRoles);
    setAvailableRoles(updatedAvailableRoles);
  };

  const handleRemoveRole = () => {
    const updatedSelectedRoles = [...selectedRoles];
    const updatedAvailableRoles = [...availableRoles];
    availableRoles.forEach((role) => {
      const index = updatedSelectedRoles.indexOf(role);
      updatedSelectedRoles.splice(index, 1);
    });
    setUser({ ...user, usergroupRoles: updatedSelectedRoles });
    setSelectedRoles(updatedSelectedRoles);
    setAvailableRoles(updatedAvailableRoles);
  };

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

  return (
    <div>
      <Header />
      <div className='container mt-4'>
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
              value={user.name}
              onChange={handleChange}
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
              value={user.password}
              onChange={handleChange}
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
              value={user.email}
              onChange={handleChange}
            />
          </div>
          <div className='form-check mb-3'>
            <input
              className='form-check-input'
              type='checkbox'
              id='disabled'
              name='disabled'
              checked={user.disabled}
              onChange={() => setUser({ ...user, disabled: !user.disabled })}
            />
            <label className='form-check-label' htmlFor='disabled'>
              Disable User
            </label>
          </div>
          <div className='mb-3'>
            <label className='form-label'>Usergroup Roles</label>
            <div className='dual-listbox'>
              <select
                className='form-select'
                multiple
                value={selectedRoles}
                onChange={handleRoleSelection}
              >
                {usergroupOptions.map((group) => (
                  <option key={group.groupid} value={group.groupid}>
                    {group.groupname}
                  </option>
                ))}
              </select>
              <div className='dual-listbox-controls'>
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
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
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
