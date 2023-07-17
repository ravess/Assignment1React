import React, { useState, useEffect, useContext } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import axios from "axios";
axios.defaults.baseURL = process.env.BACKENDURL;
axios.defaults.withCredentials = true;

import "./LoginPage.css";

export default function HomePage() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [username, setUsername] = useState("");
  const [userpassword, setUserpassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    async function fetchResults() {
      try {
        appDispatch({ type: "loadingSpinning" });
        const response = await axios.get("/user/profile");

        if (response.data.data[0]) {
          appDispatch({ type: "loadingSpinning" });
          appDispatch({ type: "isAuth", data: response.data.data[0] });
          navigate("/user/dashboard");
        }
      } catch (error) {
        appDispatch({ type: "loadingSpinning" });
        console.log("There was a problem or the request was cancelled", error);
      }
    }
    if (appState.loggedIn) {
      fetchResults();
      console.log(`setting the appstate user`);
    }

    // This cleanup function helps to cancel the request.
    return () => ourRequest.cancel();
  }, [appState.loggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    appDispatch({ type: "loadingSpinning" });
    try {
      const response = await axios.post("/login", { username, userpassword });
      if (response.data.success === true) {
        appDispatch({ type: "login" });
        appDispatch({ type: "loadingSpinning" });
      }
    } catch (error) {
      appDispatch({ type: "loadingSpinning" });
      console.log("Login Failed", error);
    }
  };

  return (
    <div className="container">
      {appState.isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Login</h5>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="userpassword">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="userpassword"
                  value={userpassword}
                  onChange={(e) => setUserpassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
