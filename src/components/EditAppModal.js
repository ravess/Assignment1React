import React, { useEffect, useContext, useState } from "react";
import axios from "axios";

import DispatchContext from "../DispatchContext";

export default function EditAppModal({
  onFormSubmit,
  key,
  showModal,
  setShowModal,
  selectedAppAcronym,
}) {
  const [app, setApp] = useState([]);
  const [usergroup, setUserGroup] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndate] = useState("");
  const [selectedPermitOpen, setSelectedPermitOpen] = useState("");
  const [selectedPermitToDoList, setSelectedPermitToDoList] = useState("");
  const [selectedPermitDoing, setSelectedPermitDoing] = useState("");
  const [selectedPermitDone, setSelectedPermitDone] = useState("");

  const appDispatch = useContext(DispatchContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "App_permit_Open") {
      setSelectedPermitOpen(value);
    } else if (name === "App_permit_toDoList") {
      setSelectedPermitToDoList(value);
    } else if (name === "App_permit_Doing") {
      setSelectedPermitDoing(value);
    } else if (name === "App_permit_Done") {
      setSelectedPermitDone(value);
    } else if (name === "App_startDate") {
      setSelectedStartDate(value);
    } else if (name === "App_endDate") {
      setSelectedEndate(value);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    document.body.classList.toggle("modal-open");
    document.body.removeChild(document.querySelector(".modal-backdrop"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formObj = {
      App_startDate: selectedStartDate,
      App_endDate: selectedEndDate,
      App_permit_Open: selectedPermitOpen,
      App_permit_toDoList: selectedPermitToDoList,
      App_permit_Doing: selectedPermitDoing,
      App_permit_Done: selectedPermitDone,
    };
    try {
      const response = await axios.put(
        `/apps/${selectedAppAcronym}/edit`,
        formObj
      );
      // Handle successful response, e.g., show a success message or perform other actions
      if (response.data.data) {
        appDispatch({
          type: "flashMessage",
          value: "App Successfully Updated",
        });
        onFormSubmit();
        toggleModal();
      }
    } catch (error) {
      if (error.response && error.response.data.error.statusCode === 403) {
        appDispatch({
          type: "flashMessageErr",
          value: error.response.data.errMessage,
        });
        navigate("/user/dashboard");
      }
      if (error.response && error.response.data) {
        appDispatch({
          type: "flashMessageErr",
          value: error.response.data.errMessage,
        });
      }
    }
  };

  useEffect(() => {
    if (!selectedAppAcronym) return;
    if (selectedAppAcronym === null) {
      // If selectedTaskId is null, reset the task data to an empty array
      setApp([]);
      return;
    }

    const ourRequest = axios.CancelToken.source();
    const fetchData = async () => {
      try {
        const getAppResponse = await axios.get(`/apps/${selectedAppAcronym}`);
        if (getAppResponse.data.data) {
          setApp(getAppResponse.data.data);
          setSelectedStartDate(getAppResponse.data.data[0].App_startDate);
          setSelectedEndate(getAppResponse.data.data[0].App_endDate);
          setSelectedPermitOpen(getAppResponse.data.data[0].App_permit_Open);
          setSelectedPermitToDoList(
            getAppResponse.data.data[0].App_permit_toDoList
          );
          setSelectedPermitDoing(getAppResponse.data.data[0].App_permit_Doing);
          setSelectedPermitDone(getAppResponse.data.data[0].App_permit_Done);
        }
      } catch (error) {
        if (error.response && error.response.data) {
          appDispatch({
            type: "flashMessageErr",
            value: error.response.data.errMessage,
          });
          console.log(`either navigate away or do other things`);
        }
      }
    };

    const fetchUserGroup = async () => {
      try {
        const response = await axios.get("/admin/groups");
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

    if (selectedAppAcronym) {
      fetchData();
      fetchUserGroup();
    }

    return () => ourRequest.cancel();
  }, [selectedAppAcronym]);

  return (
    <>
      <div
        className="modal fade"
        id="editAppModal"
        key={key}
        tabindex="-1"
        role="dialog"
        aria-labelledby="editAppModalTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header p-5 bg-dark text-white">
              <h5 className="modal-title" id="editAppModalTitle">
                Edit App
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" className="text-white">
                  &times;
                </span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col form-group text-left">
                    <strong>
                      <span>App Acronym: </span>
                    </strong>
                    {app.length > 0 && <span>{app[0].App_Acronym}</span>}
                  </div>
                </div>
                <div className="row">
                  <div className="col form-group text-left">
                    <strong>
                      <span>App Description:</span>
                    </strong>
                    <textarea
                      className="form-control"
                      name="Plan_startDate"
                      rows="3"
                      value={app.length > 0 && app[0].App_Description}
                      readOnly
                    ></textarea>
                  </div>
                </div>
                <div className="row">
                  <div className="col form-group text-left">
                    <strong>
                      <span>App R number: </span>
                    </strong>
                    {app.length > 0 && <span>{app[0].App_Rnumber}</span>}
                  </div>
                </div>
                <div className="row">
                  <div className="col form-group text-left p-3">
                    <label htmlFor="App_startDate" className="form-label">
                      <strong>App Start Date:</strong>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="App_startDate"
                      value={selectedStartDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col form-group text-left p-3">
                    <label htmlFor="App_endDate" className="form-label">
                      <strong>App End Date:</strong>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="App_endDate"
                      value={selectedEndDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col form-group text-left p-3">
                    <label htmlFor="App_permit_Open" className="form-label">
                      <strong>Permit Open:</strong>
                    </label>
                    <select
                      className="form-control"
                      id="App_permit_Open"
                      name="App_permit_Open"
                      value={selectedPermitOpen}
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
                  <div className="col form-group text-left p-3">
                    <label htmlFor="App_permit_toDoList" className="form-label">
                      <strong>Permit To Do List</strong>
                    </label>
                    <select
                      className="form-control"
                      id="App_permit_toDoList"
                      name="App_permit_toDoList"
                      value={selectedPermitToDoList}
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
                  <div className="col form-group text-left p-3">
                    <label htmlFor="App_permit_Doing" className="form-label">
                      <strong>Permit Doing</strong>
                    </label>
                    <select
                      className="form-control"
                      id="App_permit_Doing"
                      name="App_permit_Doing"
                      value={selectedPermitDoing}
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
                  <div className="col form-group text-left p-3">
                    <label htmlFor="App_permit_Done" className="form-label">
                      <strong>Permit Done</strong>
                    </label>
                    <select
                      className="form-control"
                      id="App_permit_Done"
                      name="App_permit_Done"
                      value={selectedPermitDone}
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
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-dark">
                  Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
