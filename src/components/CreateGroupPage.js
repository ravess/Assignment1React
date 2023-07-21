import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import LoadingSpinner from "./LoadingSpinner";

export default function CreateUserForm() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const [createGroup, setCreateGroup] = useState("");
  const [hasError, setHasError] = useState(false);
  const [count, setCount] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      appDispatch({ type: "loadingSpinning" });
      const response = await axios.post("/admin/groups/create", {
        usergroup: createGroup,
      });
      if (response.data) {
        appDispatch({ type: "loadingSpinning" });
        appDispatch({ type: "flashMessage", value: "Group created" });
      }
    } catch (error) {
      appDispatch({ type: "loadingSpinning" });
      console.log(error);
    }
  };

  return (
    <div>
      {appState.isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="container d-flex flex-column mt-3 border border-dark rounded w-50">
          <h2>Create Group</h2>
          <form className="form-group" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Groupname
              </label>
              <input
                type="text"
                className="form-control"
                id="usergroup"
                value={createGroup}
                onChange={(e) => {
                  if (e.target.value.length < 0) {
                    setHasError(true);
                  } else {
                    setCreateGroup(e.target.value);
                    setHasError(false);
                  }
                }}
                required
                autoFocus
              />
            </div>

            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-dark d-flex ml-0 justify-content-center"
                disabled={hasError}
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
