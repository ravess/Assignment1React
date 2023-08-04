import React, { useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";

export default function TaskCard({ task, onTaskCardClick, onFormSubmit }) {
  const params = useParams();
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);

  const handlePromote = async () => {
    try {
      const response = await axios.put(
        `/apps/${params.appacronym}/tasks/${task.Task_id}/edit`,
        {
          Task_state: task.Task_state,
          Task_newState: "promote",
          Task_notes: "",
          usergroup: "admin",
        }
      );
      if (response.data.data) {
        appDispatch({
          type: "flashMessage",
          value: "Task State Promoted",
        });
        onFormSubmit();
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

  const handleDemote = async () => {
    try {
      const response = await axios.put(
        `/apps/${params.appacronym}/tasks/${task.Task_id}/edit`,
        {
          Task_state: task.Task_state,
          Task_newState: "demote",
          Task_notes: "",
          usergroup: "admin",
        }
      );
      if (response.data.data) {
        appDispatch({
          type: "flashMessage",
          value: "Task State Demoted",
        });
        onFormSubmit();
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
  return (
    <>
      <div className="container-fluid card mt-3">
        <div className="card-body">
          <div className="row d-flex justify-content-end">
            <span
              onClick={() => onTaskCardClick(task.Task_id)}
              data-toggle="modal"
              data-target="#editTaskModal"
            >
              <i className="fa fa-list" aria-hidden="true"></i>
            </span>
          </div>
          <div className="row">
            <span>
              <strong>Task Name: </strong>
              <br />
            </span>
            <span className="card-title text-truncate">{task.Task_name}</span>
          </div>

          <div
            className={`row d-flex justify-content-${
              task.Task_state === "open" ? "end" : "between"
            }`}
          >
            {task.Task_state !== "open" && task.Task_state !== "closed" && (
              <div onClick={handleDemote}>
                <i className="fa fa-arrow-circle-left"></i>
              </div>
            )}

            {task.Task_state !== "closed" && (
              <div onClick={handlePromote}>
                <i className="fa fa-arrow-circle-right"></i>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
