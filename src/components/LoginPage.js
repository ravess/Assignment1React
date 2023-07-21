import React, { useState, useEffect, useContext } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import axios from "axios";
axios.defaults.baseURL = process.env.BACKENDURL;
axios.defaults.withCredentials = true;

// import "./LoginPage.css";

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
          appDispatch({
            type: "flashMessage",
            value: "You've logged in successfully!",
          });
          navigate("/user/dashboard");
        }
      } catch (error) {
        appDispatch({ type: "loadingSpinning" });
        console.log("There was a problem or the request was cancelled", error);
      }
    }
    if (appState.loggedIn) {
      fetchResults();
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
        appDispatch({ type: "flashMessage", value: "Successfully logged in!" });
      }
    } catch (error) {
      appDispatch({ type: "loadingSpinning" });
      if (error.response.data.error.statusCode === 401) {
        console.log(error.response.data.errMessage);
      }
    }
  };

  return (
    <div className="d-flex mt-5">
      <div className="container w-50 d-flex justify-content-center align-content mt-5">
        {appState.isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="card w-50 d-flex align-items-center border border-dark bg-light">
            <div className="card-body justify-content-center">
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
                <button
                  type="submit"
                  className="btn btn-outline-dark btn-block ml-0"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
