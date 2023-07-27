import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

export default function CreateGroupForm() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const [createGroup, setCreateGroup] = useState("");
  const [hasError, setHasError] = useState(false);
  const [displayGroups, setDisplayGroups] = useState([]);

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    async function fetchGroup() {
      try {
        const response = await axios.get("/admin/groups");
        if (response.data.data) {
          setDisplayGroups(response.data.data);
        }
      } catch (error) {
        if (error.response.data.error.statusCode === 403) {
          appDispatch({
            type: "flashMessageErr",
            value: error.response.data.errMessage,
          });
          navigate("/user/dashboard");
        }
        if (error.response.data)
          appDispatch({
            type: "flashMessageErr",
            value: error.response.data.errMessage,
          });
      }
    }

    // fetchResults();
    fetchGroup();
    return () => ourRequest.cancel();
  }, [createGroup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/admin/groups/create", {
        usergroup: createGroup,
      });
      if (response.data)
        appDispatch({ type: "flashMessage", value: "Group created" });
      setCreateGroup("");
    } catch (error) {
      if (error.response.data.error.statusCode === 403) {
        appDispatch({
          type: "flashMessageErr",
          value: error.response.data.errMessage,
        });
        navigate("/user/dashboard");
      }
      if (error.response.data)
        appDispatch({
          type: "flashMessageErr",
          value: error.response.data.errMessage,
        });
    }
  };

  return (
    <>
      {appState.user.userisAdmin ? (
        <div className="d-flex flex-column align-items-center">
          <h2>Current Groups:</h2>
          <div className="mt-3 border border-dark rounded w-50">
            <div className="container mt-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>Available group to assign</th>
                  </tr>
                </thead>
                <tbody>
                  {displayGroups.map((group, index) => (
                    <tr key={index}>
                      <td> {group.groupname} </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="container mt-3">
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
                        setCreateGroup(e.target.value.trim());
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
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
