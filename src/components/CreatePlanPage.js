import React, { useState, useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";
import axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateAppPage() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const originalState = {
    mvp_name: {
      value: "",
      hasErrors: false,
      message: "",
    },
    startDate: {
      value: "",
      hasErrors: false,
      message: "",
    },
    endDate: {
      value: "",
    },
    usergroups: {
      data: [],
    },
    selectedUsergroups: {
      value: "",
    },
    submitCount: 0,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchUserGroup":
        draft.usergroups.data = action.data;
        return;
      case "selectedUsergroups":
        draft.selectedUsergroups.hasErrors = false;
        draft.selectedUsergroups.value = action.value;
        return;

      case "submitRequest":
        if (!draft.username.hasErrors && !draft.userpassword.hasErrors) {
          (draft.username.value = ""),
            (draft.userpassword.value = ""),
            (draft.selectedUsergroups.value = ""),
            (draft.useremail.value = ""),
            (draft.userisActive.value = true);
          draft.submitCount++;
        }
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    return () => ourRequest.cancel();
  }, []);

  //This portions help to create an array when you select the option.value in the select so that we can use join method to become a string like
  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    const joinedSelectedOptions = "." + selectedOptions.join(".") + ".";
    dispatch({ type: "selectedUsergroups", value: joinedSelectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/apps/create", {
        App_Description: "",
        App_Acronym: "",
        App_Rnumber: "",
        App_startDate: "",
        App_endDate: "",
        App_permit_Open: "",
        App_permit_toDoList: "",
      });
      if (response.data) {
        dispatch({ type: "submitRequest" });
        appDispatch({
          type: "flashMessage",
          value: "App succesfully created",
        });
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
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <div className="d-flex flex-column mt-3 border border-dark rounded w-75 p-3">
          <h2>Create Plan</h2>
          <form className="form-group" onSubmit={handleSubmit}>
            <div className="mb-3 w-50">
              <label htmlFor="username" className="form-label">
                Application Acronym
              </label>
              <input
                type="text"
                className="form-control"
                id="acronym"
                onChange={(e) => console.log(`you click me`)}
                required
                autoFocus
                onBlur={(e) => console.log(`you clicked me`)}
              />
              {state.acronym.hasErrors && (
                <div className="alert alert-danger small liveValidateMessage">
                  {state.acronym.message}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Application Description
              </label>
              <textarea
                class="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
              ></textarea>
              {state.description.hasErrors && (
                <div className="alert alert-danger small liveValidateMessage">
                  {state.description.message}
                </div>
              )}
            </div>
            <div className="row">
              <div className="col">
                {" "}
                <div className="mb-3">
                  <label htmlFor="useremail" className="form-label">
                    App R Number
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="number"
                    onChange={(e) => console.log(`you clicked me`)}
                  />
                </div>
              </div>
              <div className="col">
                <div className="mb-3">
                  <label htmlFor="useremail" className="form-label">
                    App Start Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="startDate"
                    onChange={(e) => console.log(`you clicked me`)}
                  />
                </div>
              </div>
              <div className="col">
                {" "}
                <div className="mb-3">
                  <label htmlFor="useremail" className="form-label">
                    App End Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="endDate"
                    onChange={(e) => console.log(`you clicked me`)}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex flex-column">
              <div className="row">
                <div className="col d-flex flex-column">
                  <label htmlFor="usergroups" className="form-label">
                    Permit Open
                  </label>
                  <select
                    multiple
                    className="form-select"
                    id="usergroups"
                    onChange={handleSelectChange}
                  >
                    {state.usergroups.data.map((group) => {
                      return (
                        <option key={group.groupid} value={group.groupname}>
                          {group.groupname}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col d-flex flex-column">
                  <label htmlFor="usergroups" className="form-label">
                    Permit to Do List
                  </label>
                  <select
                    multiple
                    className="form-select"
                    id="usergroups"
                    onChange={handleSelectChange}
                  >
                    {state.usergroups.data.map((group) => {
                      return (
                        <option key={group.groupid} value={group.groupname}>
                          {group.groupname}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col d-flex flex-column">
                  <label htmlFor="usergroups" className="form-label">
                    Permit Doing
                  </label>
                  <select
                    multiple
                    className="form-select"
                    id="usergroups"
                    onChange={handleSelectChange}
                  >
                    {state.usergroups.data.map((group) => {
                      return (
                        <option key={group.groupid} value={group.groupname}>
                          {group.groupname}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col d-flex flex-column">
                  <label htmlFor="usergroups" className="form-label">
                    Permit Done
                  </label>
                  <select
                    multiple
                    className="form-select"
                    id="usergroups"
                    onChange={handleSelectChange}
                  >
                    {state.usergroups.data.map((group) => {
                      return (
                        <option key={group.groupid} value={group.groupname}>
                          {group.groupname}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-dark d-flex ml-0 justify-content-center"
                disabled={true}
              >
                Create App
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
