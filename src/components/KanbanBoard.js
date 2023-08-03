import React, { useContext, useEffect, useState } from "react";
import { useImmerReducer } from "use-immer";
import axios from "axios";
import DispatchContext from "../DispatchContext";
import { useNavigate, useParams } from "react-router-dom";
import CreateTaskModal from "./CreateTaskModal";
import CreatePlanModal from "./CreatePlanModal";
import EditPlanModal from "./EditPlanModal";
import TaskCard from "./TaskCard";
import EditTaskModal from "./EditTaskModal";

export default function KanbanBoard() {
  const appDispatch = useContext(DispatchContext);
  const params = useParams();
  const navigate = useNavigate();
  const originalState = {
    app: {
      data: [],
    },
    tasks: {
      data: [],
    },
    plans: {
      data: [],
    },
    usergroups: {
      data: [],
    },
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchApp":
        draft.app.data = action.data;
        return;
      case "fetchAllTasks":
        draft.tasks.data = action.data;
        return;
      case "fetchAllPlans":
        draft.plans.data = action.data;
        return;
      case "fetchUserGroup":
        draft.usergroups.data = action.data;
        return;
      case "submitRequest":
        if (!draft.username.hasErrors && !draft.userpassword.hasErrors) {
          draft.submitCount++;
        }
        return;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, originalState);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [key, setKey] = useState(0);
  const [isPlanFormSubmitted, setIsPlanFormSubmitted] = useState(false);
  const [isTaskFormSubmitted, setIsTaskFormSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleTaskCardClick = (taskid) => {
    setSelectedTaskId(taskid);
    setKey((prevKey) => prevKey + 1); // Update the key to trigger a re-render
    setShowModal(true);
  };

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    const fetchData = async () => {
      try {
        const profileResponse = await axios.get("/user/profile");
        if (profileResponse.data.data[0]) {
          appDispatch({ type: "isAuth", data: profileResponse.data.data[0] });
        }
        const appResponse = await axios.get(`/apps/${params.appacronym}`);
        if (appResponse.data.data) {
          dispatch({ type: "fetchApp", data: appResponse.data.data });
        }
        const getAllTasksResponse = await axios.get(
          `/apps/${params.appacronym}/tasks`
        );
        if (getAllTasksResponse.data.data) {
          dispatch({
            type: "fetchAllTasks",
            data: getAllTasksResponse.data.data,
          });
        }
        const getAllPlansResponse = await axios.get(
          `/apps/${params.appacronym}/plans`
        );
        if (getAllPlansResponse.data.data) {
          dispatch({
            type: "fetchAllPlans",
            data: getAllPlansResponse.data.data,
          });
        }
      } catch (error) {
        if (error.response.data) {
          appDispatch({
            type: "flashMessageErr",
            value: error.response.data.errMessage,
          });
          console.log(`either navigate away or do other things`);
        }
      }
    };

    fetchData();
    return () => ourRequest.cancel();
  }, []);

  // This is the useeffect to trigger a get request based on form submission to get latest
  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    const fetchData = async () => {
      try {
        if (isTaskFormSubmitted) {
          const getAllTasksResponse = await axios.get(
            `/apps/${params.appacronym}/tasks`
          );
          if (getAllTasksResponse.data.data) {
            dispatch({
              type: "fetchAllTasks",
              data: getAllTasksResponse.data.data,
            });
            setIsTaskFormSubmitted(false);
          }
        }
        if (isPlanFormSubmitted) {
          const getAllPlansResponse = await axios.get(
            `/apps/${params.appacronym}/plans`
          );
          if (getAllPlansResponse.data.data) {
            dispatch({
              type: "fetchAllPlans",
              data: getAllPlansResponse.data.data,
            });
            setIsPlanFormSubmitted(false);
          }
        }
      } catch (error) {
        if (error.response.data) {
          appDispatch({
            type: "flashMessageErr",
            value: error.response.data.errMessage,
          });
          console.log(`either navigate away or do other things`);
        }
      }
    };

    fetchData();
    return () => ourRequest.cancel();
  }, [isPlanFormSubmitted, isTaskFormSubmitted, params.appacronym]);

  return (
    <div>
      <div className="ml-5 mt-3" onClick={() => navigate(-1)}>
        <i
          className="fa fa-arrow-left fa-2x align-self-center"
          aria-hidden="true"
          style={{ cursor: "pointer" }}
        ></i>
      </div>
      <div className="container-fluid text-center">
        {state.app.data.length > 0 && (
          <p className="dashboard__description text-center">
            {state.app.data[0].App_Acronym}
          </p>
        )}
        <div className="container d-flex justify-content-start m-0">
          <button
            className="btn btn-outline-dark mt-2 mr-2"
            style={{ width: "150px" }}
            data-toggle="modal"
            data-target="#createTaskModal"
            onClick={() => setShowModal(true)}
          >
            <i className="fas fa-plus"></i> Create Task
          </button>

          <button
            className="btn btn-outline-dark mt-2 mr-2"
            style={{ width: "150px" }}
            data-toggle="modal"
            data-target="#createPlanModal"
            onClick={() => setShowModal(true)}
          >
            <i className="fas fa-plus"></i> Create Plan
          </button>
          <button
            className="btn btn-outline-dark mt-2 mr-2"
            style={{ width: "150px" }}
            data-toggle="modal"
            data-target="#editPlanModal"
            onClick={() => setShowModal(true)}
          >
            <i className="fas fa-edit"></i> Edit Plan
          </button>
        </div>
        <div className="container-fluid mt-5">
          <div className="row">
            <div className="col border mx-4 p-2">
              <h3>Open State</h3>
              {state.tasks.data
                .filter((task) => task.Task_state === "open")
                .map((task) => (
                  <TaskCard
                    key={task.Task_id}
                    task={task}
                    onTaskCardClick={handleTaskCardClick}
                  />
                ))}
            </div>
            <div className="col border mx-4 p-2">
              <h3>To Do</h3>
              {state.tasks.data
                .filter((task) => task.Task_state === "todo")
                .map((task) => (
                  <TaskCard
                    key={task.Task_id}
                    task={task}
                    onTaskCardClick={handleTaskCardClick}
                  />
                ))}
            </div>
            <div className="col border mx-4 p-2">
              <h3>Doing</h3>
              {state.tasks.data
                .filter((task) => task.Task_state === "doing")
                .map((task) => (
                  <TaskCard
                    key={task.Task_id}
                    task={task}
                    onTaskCardClick={handleTaskCardClick}
                  />
                ))}
            </div>

            <div className="col border mx-4 p-2">
              <h3>Done</h3>
              {state.tasks.data
                .filter((task) => task.Task_state === "done")
                .map((task) => (
                  <TaskCard
                    key={task.Task_id}
                    task={task}
                    onTaskCardClick={handleTaskCardClick}
                  />
                ))}
            </div>
            <div className="col border mx-4 p-2">
              <h3>Closed</h3>
              {state.tasks.data
                .filter((task) => task.Task_state === "closed")
                .map((task) => (
                  <TaskCard
                    key={task.Task_id}
                    task={task}
                    onTaskCardClick={handleTaskCardClick}
                  />
                ))}
            </div>
          </div>
        </div>
        <div>
          {showModal && (
            <>
              <CreateTaskModal
                plans={state.plans.data}
                onFormSubmit={() => setIsTaskFormSubmitted(true)}
                showModal={showModal}
                setShowModal={setShowModal}
              />
              <CreatePlanModal
                onFormSubmit={() => setIsPlanFormSubmitted(true)}
                showModal={showModal}
                setShowModal={setShowModal}
              />
              <EditTaskModal
                selectedTaskId={selectedTaskId}
                key={key}
                plans={state.plans.data}
                onFormSubmit={() => setIsTaskFormSubmitted(true)}
                isFormSubmitted={isTaskFormSubmitted}
                showModal={showModal}
                setShowModal={setShowModal}
              />
              <EditPlanModal
                plans={state.plans.data}
                onFormSubmit={() => setIsPlanFormSubmitted(true)}
                showModal={showModal}
                setShowModal={setShowModal}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
