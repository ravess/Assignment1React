import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import axios from "axios";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
axios.defaults.withCredentials = true;

export default function Header() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const usergroupArr = appState.user.usergroup.split(",");

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const response = await axios.get("/logout");
      if (response.data.success) {
        appDispatch({ type: "logout" });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createUser = () => {
    console.log("Create User...");
  };

  const viewAccount = () => {
    console.log("View Account...");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/user/dashboard" className="brand">
          TMS
        </Link>
        <div className="navbar-items">
          <span className="welcome-message">
            Welcome, {appState.user.username}
          </span>
          <div className="button-container">
            {usergroupArr.includes("admin") ? (
              <Link to="/admin/users">
                <button className="create-button" onClick={createUser}>
                  <i className="fas fa-users"></i> Users
                </button>
              </Link>
            ) : (
              ""
            )}
            <Link to="/user/profile">
              <button className="view-account" onClick={viewAccount}>
                <i className="fas fa-user"></i> My Profile
              </button>
            </Link>
            <button className="sign-out-button" onClick={handleSignOut}>
              <i className="fas fa-sign-out-alt"></i> Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
