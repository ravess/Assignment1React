import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPage.css";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    // Handle edit functionality for the user
    console.log(`Editing user with ID: ${userId}`);
  };

  const handleDisable = (userId) => {
    // Handle disable functionality for the user
    console.log(`Disabling user with ID: ${userId}`);
  };

  return (
    <div>
      <Header />
      <div className="user-list-container">
        <h2>User List</h2>
        <div className="table-container">
          <div className="table-header">
            <div>ID</div>
            <div>Name</div>
            <div>Email</div>
            <div>Actions</div>
          </div>
          {users.map((user) => (
            <div key={user.id} className="table-row">
              <div>{user.id}</div>
              <div>{user.name}</div>
              <div>{user.email}</div>
              <div>
                <button onClick={() => handleEdit(user.id)}>Edit</button>
                <button onClick={() => handleDisable(user.id)}>Disable</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
