import React, { useContext, useState } from "react";
import axios from "axios";
import Header from "./Header";
import StateContext from "../StateContext";

export default function ProfilePage() {
  const appState = useContext(StateContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your backend API to update the email and password
      const response = await axios.put("/user/profile/edit", {
        useremail: email,
        userpassword: password,
      });
      if (response.status === 200) {
        console.log(response.data);
        setMessage("Profile updated successfully.");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.log(error.response.data);
      setMessage("An error occurred while updating the profile.");
    }
  };

  return (
    <div>
      <Header />
      <div className="container justify-content-center w-50 mt-5">
        <div className="profile-card card p-3 border border-dark .bg-light">
          <h1 className="card-title">Profile</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={appState.user.username}
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <button
              type="submit"
              className="btn btn-outline-primary btn-block ml-0 mt-3"
            >
              Update Profile
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
}
