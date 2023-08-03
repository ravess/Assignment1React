import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import { useNavigate } from "react-router-dom";

export default function CreateAppPage() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const initialState = {
    App_Description: "",
    App_Acronym: "",
    App_Rnumber: "",
    App_startDate: "",
    App_endDate: "",
    App_permit_Open: "",
    App_permit_toDoList: "",
    App_permit_Doing: "",
    App_permit_Done: "",
  };
  const [usergroup, setUserGroup] = useState([]);
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    const fetchUsergroups = async () => {
      try {
        const response = await axios.post("/admin/groups", {
          usergroup: "admin",
        });
        if (response.data.data) {
          setUserGroup(response.data.data);
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
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/user/profile");
        if (response.data.data[0]) {
          appDispatch({ type: "isAuth", data: response.data.data[0] });
        }
      } catch (error) {
        if (error.response.data) {
          appDispatch({
            type: "flashMessageErr",
            value: error.response.data.errMessage,
          });
          navigate("/");
        }
      }
    };
    fetchProfile();
    fetchUsergroups();
    return () => ourRequest.cancel();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/apps/create", {
        ...formData,
        usergroup: "admin",
      });
      if (response.data.data) {
        appDispatch({
          type: "flashMessage",
          value: "App succesfully created",
        });
        setFormData(initialState);
      }
    } catch (error) {
      if (error.response && error.response.data.error.statusCode === 403) {
        appDispatch({
          type: "flashMessageErr",
          value: error.response.data.errMessage,
        });
        navigate("/user/dashboard");
      }
      if (error.response && error.response.data)
        appDispatch({
          type: "flashMessageErr",
          value: error.response.data.errMessage,
        });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-start">
        <div className="ml-5 mt-3" onClick={() => navigate(-1)}>
          <i
            class="fa fa-arrow-left fa-2x align-self-center"
            aria-hidden="true"
            style={{ cursor: "pointer" }}
          ></i>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div className="d-flex flex-column mt-3 border border-dark rounded w-75 p-3">
          <h2 className="contianer-fluid bg-dark text-white p-5">Create App</h2>
          <form className="form-group" onSubmit={handleSubmit}>
            <div className="mb-3 w-50">
              <label htmlFor="App_Acronym" className="form-label">
                <strong>Application Acronym</strong>
              </label>
              <input
                type="text"
                className="form-control"
                id="App_Acronym"
                name="App_Acronym"
                value={formData.App_Acronym}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
            <div className="mb-3">
              <label htmlFor="App_Description" className="form-label">
                <strong>Application Description</strong>
              </label>
              <textarea
                class="form-control"
                id="App_Description"
                name="App_Description"
                value={formData.App_Description}
                rows="3"
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="row">
              <div className="col">
                {" "}
                <div className="mb-3">
                  <label htmlFor="App_Rnumber" className="form-label">
                    <strong>App R Number</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="App_Rnumber"
                    name="App_Rnumber"
                    value={formData.App_Rnumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="mb-3">
                  <label htmlFor="App_startDate" className="form-label">
                    <strong>App Start Date</strong>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="App_startDate"
                    name="App_startDate"
                    value={formData.App_startDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col">
                {" "}
                <div className="mb-3">
                  <label htmlFor="App_endDate" className="form-label">
                    <strong>App End Date</strong>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="App_endDate"
                    name="App_endDate"
                    value={formData.App_endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex flex-column">
              <div className="row">
                <div className="col d-flex flex-column">
                  <label htmlFor="App_permit_Open" className="form-label">
                    <strong>Permit Open</strong>
                  </label>
                  <select
                    className="form-control"
                    id="App_permit_Open"
                    name="App_permit_Open"
                    value={formData.App_permit_Open}
                    onChange={handleChange}
                  >
                    <option value="">Select Permission</option>
                    {usergroup.map((group) => {
                      return (
                        <option key={group.groupid} value={group.groupname}>
                          {group.groupname}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col d-flex flex-column">
                  <label htmlFor="App_permit_toDoList" className="form-label">
                    <strong>Permit to Do List</strong>
                  </label>
                  <select
                    className="form-control"
                    id="App_permit_toDoList"
                    name="App_permit_toDoList"
                    value={formData.App_permit_toDoList}
                    onChange={handleChange}
                  >
                    <option value="">Select Permission</option>
                    {usergroup.map((group) => {
                      return (
                        <option key={group.groupid} value={group.groupname}>
                          {group.groupname}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col d-flex flex-column">
                  <label htmlFor="App_permit_Doing" className="form-label">
                    <strong>Permit Doing</strong>
                  </label>
                  <select
                    className="form-control"
                    id="App_permit_Doing"
                    name="App_permit_Doing"
                    value={formData.App_permit_Doing}
                    onChange={handleChange}
                  >
                    <option value="">Select Permission</option>
                    {usergroup.map((group) => {
                      return (
                        <option key={group.groupid} value={group.groupname}>
                          {group.groupname}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col d-flex flex-column">
                  <label htmlFor="App_permit_Done" className="form-label">
                    <strong>Permit Done</strong>
                  </label>
                  <select
                    className="form-control"
                    id="App_permit_Done"
                    name="App_permit_Done"
                    value={formData.App_permit_Done}
                    onChange={handleChange}
                  >
                    <option value="">Select Permission</option>
                    {usergroup.map((group) => {
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
