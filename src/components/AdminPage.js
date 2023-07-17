import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import "./AdminPage.css";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/admin/users");
        if (response.data.data) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = async (userId) => {
    // Handle edit functionality for the user
    const response = await axios.put("/admin/users/:userid/edit");
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
            <div>Name</div>
            <div>Email</div>
            <div>Actions</div>
          </div>
          {users.map((user, idx) => (
            <div key={idx} className="table-row">
              <div>{user.username}</div>
              <div>{user.useremail}</div>
              <div>
                <button
                  className="edit-button"
                  onClick={() => handleEdit(user.userid)}
                >
                  Edit
                </button>
                <button
                  className="disable-button"
                  onClick={() => handleDisable(user.id)}
                >
                  Disable
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
