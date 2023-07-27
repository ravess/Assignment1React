import React, { useContext, useEffect, useState } from "react";
import { useImmerReducer, useImmer } from "use-immer";
import axios from "axios";
import DispatchContext from "../DispatchContext";
import { useNavigate, Link, useParams } from "react-router-dom";

export default function KanbanBoard() {
  const appDispatch = useContext(DispatchContext);
  const params = useParams();
  const navigate = useNavigate();
  const originalState = {
    touse: {
      value: "",
      hasErrors: false,
      message: "",
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
          draft.submitCount++;
        }
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
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
    const fetchApp = async () => {
      try {
        const response = await axios.get(`/apps/${params.appacronym}`);
        if (response.data.data) {
          console.log(response.data.data);
          setApp(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchApp();
    fetchProfile();
    return () => ourRequest.cancel();
  }, []);

  return (
    <div>
      <div className="ml-5 mt-3" onClick={() => navigate(-1)}>
        <i
          class="fa fa-arrow-left fa-2x align-self-center"
          aria-hidden="true"
          style={{ cursor: "pointer" }}
        ></i>
      </div>
      <div className="container-fluid text-center">
        <p className="dashboard__description text-center">
          {app.length > 0 ? app[0].App_Acronym : ""}
        </p>
        <div className="container d-flex justify-content-start">
          <button className="btn btn-outline-dark mt-2 mr-2">
            <i class="fas fa-plus"></i> Create Task
          </button>
          <button className="btn btn-outline-dark mt-2 mr-2">
            <i class="fas fa-plus"></i> Edit Task
          </button>
          <button className="btn btn-outline-dark mt-2 mr-2">
            <i class="fas fa-plus"></i> Create Plan
          </button>
        </div>
      </div>
    </div>
  );
}
