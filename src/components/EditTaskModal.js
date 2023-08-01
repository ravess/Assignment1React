import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DispatchContext from "../DispatchContext";

export default function EditTaskModal({
  selectedTaskId,
  key,
  plans,
  onFormSubmit,
  showModal,
  setShowModal,
}) {
  const [task, setTask] = useState([]);
  const [notes, setNotes] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const appDispatch = useContext(DispatchContext);
  const params = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "Task_plan") {
      setSelectedPlan(value);
    } else if (name === "Task_notes") {
      setNotes(value);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    document.body.classList.toggle("modal-open");
    document.body.removeChild(document.querySelector(".modal-backdrop"));
  };

  const handlePromote = async () => {
    try {
      const response = await axios.put(
        `/apps/${params.appacronym}/tasks/${selectedTaskId}/edit`,
        {
          Task_state: task[0].Task_state,
          Task_newState: "promote",
          Task_notes: notes,
        }
      );
      if (response.data.data) {
        appDispatch({
          type: "flashMessage",
          value: "Task State Promoted",
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

  const handleDemote = async () => {
    try {
      const response = await axios.put(
        `/apps/${params.appacronym}/tasks/${selectedTaskId}/edit`,
        {
          Task_state: task[0].Task_state,
          Task_newState: "demote",
          Task_notes: notes,
        }
      );
      if (response.data.data) {
        appDispatch({
          type: "flashMessage",
          value: "Task State Demoted",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const combinedData = {
      Task_notes: notes,
      Task_plan: selectedPlan,
      Task_state: task[0].Task_state,
    };
    if (selectedPlan) {
      combinedData.Task_plan = selectedPlan;
    }
    try {
      const response = await axios.put(
        `/apps/${params.appacronym}/tasks/${selectedTaskId}/edit`,
        combinedData
      );
      // Handle successful response, e.g., show a success message or perform other actions
      if (response.data.data) {
        appDispatch({
          type: "flashMessage",
          value: "Task Successfully Updated",
        });
        setNotes("");
        onFormSubmit();
        toggleModal();
        if (formRef.current) {
          formRef.current.reset();
        }
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
    if (!selectedTaskId) return;
    if (selectedTaskId === null) {
      // If selectedTaskId is null, reset the task data to an empty array
      setTask([]);
      return;
    }

    const ourRequest = axios.CancelToken.source();
    const fetchData = async () => {
      try {
        const getTasksResponse = await axios.get(
          `/apps/${params.appacronym}/tasks/${selectedTaskId}`
        );
        if (getTasksResponse.data.data) {
          setTask(getTasksResponse.data.data);
          setSelectedPlan(getTasksResponse.data.data[0].Task_plan);
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
    if (selectedTaskId) {
      fetchData();
    }

    return () => ourRequest.cancel();
  }, [selectedTaskId]);

  return (
    <>
      <div
        className="modal fade"
        id="editTaskModal"
        key={key}
        tabindex="-1"
        role="dialog"
        aria-labelledby="editTaskModalTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header bg-dark p-5 text-white">
              <h5 className="modal-title" id="editTaskModalTitle">
                Task Details
              </h5>

              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              >
                <span aria-hidden="true" className="text-white">
                  &times;
                </span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group text-left">
                  <strong>
                    <span>Task Name: </span>
                  </strong>
                  {task.length > 0 && <span>{task[0].Task_name}</span>}
                </div>
                <div className="form-group text-left">
                  <strong>Task Description:</strong>
                  <textarea
                    class="form-control"
                    id="Task_description"
                    rows="3"
                    value={task.length > 0 && task[0].Task_description}
                    readOnly
                  ></textarea>
                </div>
                <div className="form-group text-left">
                  <strong>
                    <span>Task State: </span>
                  </strong>
                  {task.length > 0 && <span>{task[0].Task_state}</span>}
                </div>
                {task.length > 0 && (
                  <div className="form-group text-left">
                    <strong>
                      <span>Created On: </span>
                    </strong>
                    {task.length > 0 && (
                      <span>
                        {task[0].Task_notes[0].date} <strong>by </strong>
                        {task[0].Task_creator}
                      </span>
                    )}
                  </div>
                )}
                <div className="form-group text-left">
                  <strong>
                    <span>Task Owner: </span>
                  </strong>
                  {task.length > 0 && <span>{task[0].Task_owner}</span>}
                </div>
                <div class="form-group text-left">
                  <label for="Task_plan">
                    <strong>Task Plan:</strong>
                  </label>
                  <select
                    class="form-control"
                    id="Task_plan"
                    name="Task_plan"
                    value={selectedPlan}
                    onChange={handleChange}
                  >
                    <option value="">Select a Plan</option>
                    {plans.map((plan) => (
                      <option
                        key={plan.Plan_MVP_name}
                        value={plan.Plan_MVP_name}
                      >
                        {plan.Plan_MVP_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group text-left">
                  <label htmlFor="Task_notes" className="form-label">
                    <strong>Audit Trail:</strong>
                  </label>
                  <textarea
                    class="form-control"
                    id="Task_notes"
                    rows="10"
                    name="Task_notes"
                    readOnly
                    value={
                      task.length > 0
                        ? task[0].Task_notes.map((entry) => {
                            return `\n [Username: ${entry.username}, State: ${entry.currentState}, Date: ${entry.date}, ${entry.timestamp}]\n ${entry.notes}`;
                          }).join("\n")
                        : ""
                    }
                  ></textarea>
                </div>
                <div className="form-group text-left">
                  <label htmlFor="Task_notes" className="form-label">
                    <strong>Task Notes:</strong>
                  </label>
                  <textarea
                    class="form-control"
                    id="Task_notes"
                    rows="3"
                    name="Task_notes"
                    value={notes}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                {task.length > 0 && task[0].Task_state !== "open" ? (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleDemote}
                  >
                    Demote
                  </button>
                ) : (
                  ""
                )}
                <button type="submit" className="btn btn-dark">
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={handlePromote}
                >
                  Promote
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
