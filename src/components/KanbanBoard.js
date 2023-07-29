import React, { useContext, useEffect, useState } from 'react';
import { useImmerReducer, useImmer } from 'use-immer';
import axios from 'axios';
import DispatchContext from '../DispatchContext';
import { useNavigate, Link, useParams } from 'react-router-dom';
import CreateTaskModel from './CreateTaskModel';
import CreatePlanModel from './CreatePlanModel';
import TaskCard from './TaskCard';
import EditTaskModel from './EditTaskModel';

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
    submitCount: 0,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case 'fetchApp':
        draft.app.data = action.data;
        return;
      case 'fetchAllTasks':
        draft.tasks.data = action.data;
        return;
      case 'fetchAllPlans':
        draft.plans.data = action.data;
        return;
      case 'fetchUserGroup':
        draft.usergroups.data = action.data;
        return;
      case 'submitRequest':
        if (!draft.username.hasErrors && !draft.userpassword.hasErrors) {
          draft.submitCount++;
        }
        return;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, originalState);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [key, setKey] = useState(0);
  const handleMoveLeft = (taskId) => {
    // Move the task with the given taskId to the left column
    // Implement your state transition logic here
  };

  const handleMoveRight = (taskId) => {
    // Move the task with the given taskId to the right column
    // Implement your state transition logic here
  };

  const handleTaskCardClick = (taskid) => {
    setSelectedTaskId(taskid);
    setKey((prevKey) => prevKey + 1); // Update the key to trigger a re-render
  };

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    const fetchData = async () => {
      try {
        const profileResponse = await axios.get('/user/profile');
        if (profileResponse.data.data[0]) {
          appDispatch({ type: 'isAuth', data: profileResponse.data.data[0] });
        }
        const appResponse = await axios.get(`/apps/${params.appacronym}`);
        if (appResponse.data.data) {
          dispatch({ type: 'fetchApp', data: appResponse.data.data });
        }
        const getAllTasksResponse = await axios.get(
          `/apps/${params.appacronym}/tasks`
        );
        if (getAllTasksResponse.data.data) {
          dispatch({
            type: 'fetchAllTasks',
            data: getAllTasksResponse.data.data,
          });
        }
        const getAllPlansResponse = await axios.get(
          `/apps/${params.appacronym}/plans`
        );
        if (getAllPlansResponse.data.data) {
          console.log(getAllPlansResponse.data.data);
          dispatch({
            type: 'fetchAllPlans',
            data: getAllPlansResponse.data.data,
          });
        }
      } catch (error) {
        if (error.response.data) {
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
          console.log(`either navigate away or do other things`);
        }
      }
    };

    fetchData();
    return () => ourRequest.cancel();
  }, []);

  return (
    <div>
      <div className='ml-5 mt-3' onClick={() => navigate(-1)}>
        <i
          class='fa fa-arrow-left fa-2x align-self-center'
          aria-hidden='true'
          style={{ cursor: 'pointer' }}
        ></i>
      </div>
      <div className='container-fluid text-center'>
        {state.app.data.length > 0 && (
          <p className='dashboard__description text-center'>
            {state.app.data[0].App_Acronym}
          </p>
        )}
        <div className='container d-flex justify-content-start m-0'>
          <button
            className='btn btn-outline-dark mt-2 mr-2'
            style={{ width: '150px' }}
          >
            <i class='fas fa-edit'></i> Edit App
          </button>
          <button
            className='btn btn-outline-dark mt-2 mr-2'
            style={{ width: '150px' }}
            data-toggle='modal'
            data-target='#createTaskModal'
          >
            <i class='fas fa-plus'></i> Create Task
          </button>

          <button
            className='btn btn-outline-dark mt-2 mr-2'
            style={{ width: '150px' }}
            data-toggle='modal'
            data-target='#createPlanModal'
          >
            <i class='fas fa-plus'></i> Create Plan
          </button>
          {/* <button
            className="btn btn-outline-dark mt-2 mr-2"
            style={{ width: "150px" }}
          >
            <i class="fas fa-edit"></i> Edit Plan
          </button> */}
        </div>
        <div className='container-fluid mt-5'>
          <div className='row'>
            <div className='col border'>
              <h3>Open State</h3>
              {state.tasks.data
                .filter((task) => task.Task_state === 'open')
                .map((task) => (
                  <TaskCard
                    key={task.Task_id}
                    task={task}
                    handleMoveLeft={handleMoveLeft}
                    handleMoveRight={handleMoveRight}
                    onTaskCardClick={handleTaskCardClick}
                  />
                ))}
            </div>
            <div className='col border'>
              <h3>To Do</h3>
              {state.tasks.data
                .filter((task) => task.Task_state === 'todo')
                .map((task) => (
                  <TaskCard
                    key={task.Task_id}
                    task={task}
                    handleMoveLeft={handleMoveLeft}
                    handleMoveRight={handleMoveRight}
                    onTaskCardClick={handleTaskCardClick}
                  />
                ))}
            </div>
            <div className='col border'>
              <h3>Doing</h3>
              {state.tasks.data
                .filter((task) => task.Task_state === 'doing')
                .map((task) => (
                  <TaskCard
                    key={task.Task_id}
                    task={task}
                    handleMoveLeft={handleMoveLeft}
                    handleMoveRight={handleMoveRight}
                    onTaskCardClick={handleTaskCardClick}
                  />
                ))}
            </div>

            <div className='col border'>
              <h3>Done</h3>
              {state.tasks.data
                .filter((task) => task.Task_state === 'done')
                .map((task) => (
                  <TaskCard
                    key={task.Task_id}
                    task={task}
                    handleMoveLeft={handleMoveLeft}
                    handleMoveRight={handleMoveRight}
                    onTaskCardClick={handleTaskCardClick}
                  />
                ))}
            </div>
            <div className='col border'>
              <h3>Closed</h3>
              {state.tasks.data
                .filter((task) => task.Task_state === 'closed')
                .map((task) => (
                  <TaskCard
                    key={task.Task_id}
                    task={task}
                    handleMoveLeft={handleMoveLeft}
                    handleMoveRight={handleMoveRight}
                    onTaskCardClick={handleTaskCardClick}
                  />
                ))}
            </div>
          </div>
        </div>
        <div>
          <CreateTaskModel />
          <CreatePlanModel />
          <EditTaskModel selectedTaskId={selectedTaskId} key={key} />
        </div>
      </div>
    </div>
  );
}
