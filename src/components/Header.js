import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
// import './Header.css';
import axios from "axios";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
axios.defaults.withCredentials = true;

export default function Header() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const response = await axios.get("/logout");
      if (response.data.success) {
        appDispatch({ type: "logout" });
        appDispatch({ type: "flashMessage", value: "Successfully logged Out" });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUser = () => {
    navigate("/admin/users");
  };

  const viewAccount = () => {
    navigate("/user/profile");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/user/dashboard" className="navbar-brand">
          TMS
        </Link>
        <div className="navbar-collapse">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <span className="navbar-text mr-3">
                Welcome, {appState.user.username}
              </span>
            </li>
            {appState.user.usergroup.includes(".admin.") && (
              <li className="nav-item">
                <button
                  className="btn btn-link text-white text-decoration-none"
                  onClick={getAllUser}
                >
                  <i className="fas fa-users"></i> Users
                </button>
              </li>
            )}
            <li className="nav-item">
              <button
                className="btn btn-link text-white text-decoration-none"
                onClick={viewAccount}
              >
                <i className="fas fa-user"></i> My Profile
              </button>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-link text-white text-decoration-none"
                onClick={handleSignOut}
              >
                <i className="fas fa-sign-out-alt"></i> Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
