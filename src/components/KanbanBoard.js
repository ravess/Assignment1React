import React, { useContext, useEffect, useState } from 'react';
import { useImmerReducer } from 'use-immer';
import axios from 'axios';
import DispatchContext from '../DispatchContext';
import { useNavigate, useParams } from 'react-router-dom';
import CreateTaskModal from './CreateTaskModal';
import CreatePlanModal from './CreatePlanModal';
import EditPlanModal from './EditPlanModal';
import TaskCard from './TaskCard';
import EditTaskModal from './EditTaskModal';
import StateContext from '../StateContext';

export default function KanbanBoard() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
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
      case 'fetchPlanColors':
        draft.plansColor.data = action.data;
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
  const toggleModal = () => {
    setShowModal(!showModal);
    // document.body.classList.toggle("modal-open");
    document.body.removeAttribute('class');
    document.body.removeAttribute('style');
    document.body.removeChild(document.querySelector('.modal-backdrop'));
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
          appDispatch({
            type: 'setPermission',
            data: appResponse.data.data[0].App_permissions,
          });
          dispatch({ type: 'fetchApp', data: appResponse.data.data });
        }
        const getAllTasksResponse = await axios.get(
          `/apps/${params.appacronym}/tasks`
        );
        if (getAllTasksResponse.data.data) {
          appDispatch({
            type: 'setPermission',
            data: getAllTasksResponse.data.data[0].App_permissions,
          });
          dispatch({
            type: 'fetchAllTasks',
            data: getAllTasksResponse.data.data,
          });
        }
        const getAllPlansResponse = await axios.get(
          `/apps/${params.appacronym}/plans`
        );
        if (getAllPlansResponse.data.data) {
          dispatch({
            type: 'fetchAllPlans',
            data: getAllPlansResponse.data.data,
          });
        }
      } catch (error) {
        if (error.response && error.response.data.error.statusCode === 401) {
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
          navigate(`/apps/${params.appacronym}`);
        } else if (
          error.response &&
          error.response.data.error.statusCode === 403
        ) {
          appDispatch({ type: 'logout' });
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
          toggleModal();
          navigate('/');
        } else if (
          error.response &&
          error.response.data.error.statusCode === 405
        ) {
          console.log(error, `unable to find stuff`);
        } else if (error.response && error.response.data) {
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
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
            appDispatch({
              type: 'setPermission',
              data: getAllTasksResponse.data.data[0].App_permissions,
            });
            dispatch({
              type: 'fetchAllTasks',
              data: getAllTasksResponse.data.data,
            });
            setIsTaskFormSubmitted(false);
          }
        }
        if (isPlanFormSubmitted || isTaskFormSubmitted) {
          const getAllPlansResponse = await axios.get(
            `/apps/${params.appacronym}/plans`
          );
          if (getAllPlansResponse.data.data) {
            dispatch({
              type: 'fetchAllPlans',
              data: getAllPlansResponse.data.data,
            });
            setIsPlanFormSubmitted(false);
          }
        }
      } catch (error) {
        if (error.response && error.response.data.error.statusCode === 404) {
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
          navigate(`/apps/${params.appacronym}`);
        } else if (
          error.response &&
          error.response.data.error.statusCode === 403
        ) {
          appDispatch({ type: 'logout' });
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
          navigate('/');
        } else if (
          error.response &&
          error.response.data.error.statusCode === 405
        ) {
          console.log(error, `unable to find stuff`);
        } else if (error.response && error.response.data) {
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
        }
      }
    };

    fetchData();
    return () => ourRequest.cancel();
  }, [isPlanFormSubmitted, isTaskFormSubmitted, params.appacronym, key]);

  return (
    <>
      {appState.loggedIn && (
        <div>
          <div className='ml-5 mt-3' onClick={() => navigate(-1)}>
            <i
              className='fa fa-arrow-left fa-2x align-self-center'
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
            <div className='container-fluid m-0'>
              <div className='row d-flex justify-content-between'>
                <div className='col d-flex justify-content-start mx-2'>
                  {appState.user.userPermission.App_permit_Create && (
                    <button
                      className='btn btn-outline-dark mt-2 mr-2'
                      style={{ width: '150px' }}
                      data-toggle='modal'
                      data-target='#createTaskModal'
                      onClick={() => setShowModal(true)}
                    >
                      <i className='fas fa-plus'></i> Create Task
                    </button>
                  )}
                  {appState.user.userisPm && (
                    <>
                      <button
                        className='btn btn-outline-dark mt-2 mr-2'
                        style={{ width: '150px' }}
                        data-toggle='modal'
                        data-target='#createPlanModal'
                        onClick={() => setShowModal(true)}
                      >
                        <i className='fas fa-plus'></i> Create Plan
                      </button>
                      <button
                        className='btn btn-outline-dark mt-2 mr-2'
                        style={{ width: '150px' }}
                        data-toggle='modal'
                        data-target='#editPlanModal'
                        onClick={() => setShowModal(true)}
                      >
                        <i className='fas fa-edit'></i> Edit Plan
                      </button>
                    </>
                  )}
                </div>
                {state.app.data.length > 0 && (
                  <div className='col d-flex justify-content-end flex-column mr-4'>
                    <div className='row d-flex justify-content-end'>
                      {state.app.data[0].App_startDate ? (
                        <h5 className='mr-2'>
                          <strong>App Start Date: </strong>{' '}
                          <span className='text-secondary'>
                            {state.app.data[0].App_startDate}
                          </span>
                        </h5>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className='row d-flex justify-content-end'>
                      {state.app.data[0].App_endDate ? (
                        <h5 className='mr-2'>
                          <strong>App End Date:</strong>{' '}
                          <span className='text-secondary'>
                            {state.app.data[0].App_endDate}
                          </span>
                        </h5>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {state.tasks.data.length > 0 && (
              <div className='container-fluid mt-5' style={{ height: '100vh' }}>
                <div className='row d-flex justify-content-center'>
                  <div
                    className='col border mx-4 p-2 bg-light'
                    style={{
                      width: '10rem',
                      height: '60vh',
                      overflowY: 'auto',
                    }}
                  >
                    <h5 className='bg-dark text-white border rounded'>Open</h5>
                    <hr />
                    {state.tasks.data
                      .filter((task) => task.Task_state === 'open')
                      .map((task) => (
                        <TaskCard
                          key={task.Task_id}
                          task={task}
                          onTaskCardClick={handleTaskCardClick}
                          onFormSubmit={() => setIsTaskFormSubmitted(true)}
                          isPlanFormSubmitted={isPlanFormSubmitted}
                          isTaskFormSubmitted={isTaskFormSubmitted}
                        />
                      ))}
                  </div>
                  <div
                    className='col border mx-4 p-2 bg-light'
                    style={{
                      width: '10rem',
                      height: '60vh',
                      overflowY: 'auto',
                    }}
                  >
                    <h5 className='bg-dark text-white border rounded'>To Do</h5>
                    <hr />
                    {state.tasks.data
                      .filter((task) => task.Task_state === 'todolist')
                      .map((task) => (
                        <TaskCard
                          key={task.Task_id}
                          task={task}
                          onTaskCardClick={handleTaskCardClick}
                          onFormSubmit={() => setIsTaskFormSubmitted(true)}
                          isPlanFormSubmitted={isPlanFormSubmitted}
                          isTaskFormSubmitted={isTaskFormSubmitted}
                        />
                      ))}
                  </div>
                  <div
                    className='col border mx-4 p-2 bg-light'
                    style={{
                      width: '10rem',
                      height: '60vh',
                      overflowY: 'auto',
                    }}
                  >
                    <h5 className='bg-dark text-white border rounded'>Doing</h5>
                    <hr />
                    {state.tasks.data
                      .filter((task) => task.Task_state === 'doing')
                      .map((task) => (
                        <TaskCard
                          key={task.Task_id}
                          task={task}
                          onTaskCardClick={handleTaskCardClick}
                          onFormSubmit={() => setIsTaskFormSubmitted(true)}
                          isPlanFormSubmitted={isPlanFormSubmitted}
                          isTaskFormSubmitted={isTaskFormSubmitted}
                        />
                      ))}
                  </div>

                  <div
                    className='col border mx-4 p-2 bg-light'
                    style={{
                      width: '10rem',
                      height: '60vh',
                      overflowY: 'auto',
                    }}
                  >
                    <h5 className='bg-dark text-white border rounded'>Done</h5>
                    <hr />
                    {state.tasks.data
                      .filter((task) => task.Task_state === 'done')
                      .map((task) => (
                        <TaskCard
                          key={task.Task_id}
                          task={task}
                          onTaskCardClick={handleTaskCardClick}
                          onFormSubmit={() => setIsTaskFormSubmitted(true)}
                          isPlanFormSubmitted={isPlanFormSubmitted}
                          isTaskFormSubmitted={isTaskFormSubmitted}
                        />
                      ))}
                  </div>
                  <div
                    className='col border mx-4 p-2 bg-light'
                    style={{
                      width: '10rem',
                      height: '60vh',
                      overflowY: 'auto',
                    }}
                  >
                    <h5 className='bg-dark text-white border rounded'>
                      Closed
                    </h5>
                    <hr />
                    {state.tasks.data
                      .filter((task) => task.Task_state === 'closed')
                      .map((task) => (
                        <TaskCard
                          key={task.Task_id}
                          task={task}
                          onTaskCardClick={handleTaskCardClick}
                          onFormSubmit={() => setIsTaskFormSubmitted(true)}
                          isPlanFormSubmitted={isPlanFormSubmitted}
                          isTaskFormSubmitted={isTaskFormSubmitted}
                        />
                      ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              {showModal && (
                <CreateTaskModal
                  plans={state.plans.data}
                  onFormSubmit={() => setIsTaskFormSubmitted(true)}
                  showModal={showModal}
                  setShowModal={setShowModal}
                />
              )}
              {showModal && appState.user.userisPm && (
                <>
                  <CreatePlanModal
                    onFormSubmit={() => setIsPlanFormSubmitted(true)}
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

              {showModal && (
                <EditTaskModal
                  selectedTaskId={selectedTaskId}
                  key={key}
                  plans={state.plans.data}
                  onFormSubmit={() => setIsTaskFormSubmitted(true)}
                  isFormSubmitted={isTaskFormSubmitted}
                  showModal={showModal}
                  setShowModal={setShowModal}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
