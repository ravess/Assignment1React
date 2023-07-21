import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import LoadingSpinner from "./LoadingSpinner";

export default function CreateUserForm() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const [createGroup, setCreateGroup] = useState("");

  useEffect(() => {
    const fetchUsergroups = async () => {
      try {
        const response = await axios.get("/admin/groups");
        if (response.data) {
          dispatch({ type: "fetchUserGroup", data: response.data.data });
        }
      } catch (error) {
        console.log("Error fetching usergroups:", error);
      }
    };

    fetchUsergroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      appDispatch({ type: "loadingSpinning" });
      const response = await axios.post("/admin/groups/create", {
        usergroup: createGroup,
      });
      if (response.data) {
        // dispatch({ type: "submitRequest" });
        // appDispatch({ type: "loadingSpinning" });
      }
    } catch (error) {
      appDispatch({ type: "loadingSpinning" });
    }
  };

  return (
    <div>
      {appState.isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="container d-flex flex-column mt-3 border border-dark rounded w-50">
          <h2>Create User</h2>
          <form className="form-group" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={state.username.value}
                onChange={(e) =>
                  dispatch({ type: "usernameChange", value: e.target.value })
                }
                required
                autoFocus
                onBlur={(e) =>
                  dispatch({ type: "usernameRules", value: e.target.value })
                }
              />
              {state.username.hasErrors && (
                <div className="alert alert-danger small liveValidateMessage">
                  {state.username.message}
                </div>
              )}
            </div>

            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-dark d-flex ml-0 justify-content-center"
                // disabled={}
              >
                Create Group
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
