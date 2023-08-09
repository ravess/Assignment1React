import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';

export default function TaskCard({
  task,
  onTaskCardClick,
  onFormSubmit,
  isPlanFormSubmitted,
  isTaskFormSubmitted,
}) {
  const params = useParams();
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const [color, setColor] = useState({});

  const handlePromote = async () => {
    try {
      const response = await axios.put(
        `/apps/${params.appacronym}/tasks/${task.Task_id}/edit`,
        {
          Task_state: task.Task_state,
          Task_newState: 'promote',
          Task_notes: '',
          Task_plan: task.Task_plan,
          usergroup: 'admin',
        }
      );
      if (response.data.data) {
        appDispatch({
          type: 'flashMessage',
          value: 'Task State Promoted',
        });
        onFormSubmit();
      }
    } catch (error) {
      if (error.response && error.response.data.error.statusCode === 401) {
        onFormSubmit();
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

  const handleDemote = async () => {
    try {
      const response = await axios.put(
        `/apps/${params.appacronym}/tasks/${task.Task_id}/edit`,
        {
          Task_state: task.Task_state,
          Task_newState: 'demote',
          Task_notes: '',
          Task_plan: task.Task_plan,
          usergroup: 'admin',
        }
      );
      if (response.data.data) {
        appDispatch({
          type: 'flashMessage',
          value: 'Task State Demoted',
        });
        onFormSubmit();
      }
    } catch (error) {
      if (error.response && error.response.data.error.statusCode === 401) {
        onFormSubmit();
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

  useEffect(() => {
    const getPlanColors = async () => {
      try {
        const response = await axios.get(`/getplancolor/${task.Task_plan}`);
        if (response.data.data) {
          setColor(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getPlanColors();
  }, []);

  useEffect(() => {
    const getPlanColors = async () => {
      try {
        const response = await axios.get(`/getplancolor/${task.Task_plan}`);
        if (response.data.data) {
          setColor(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getPlanColors();
  }, [isPlanFormSubmitted, isTaskFormSubmitted]);

  return (
    <>
      <div
        className='container-fluid card mt-3'
        style={{
          border: `2px solid ${
            color.Plan_MVP_name === task.Task_plan
              ? color.Plan_color
              : '#CED4DA'
          }`,
        }}
      >
        <div className='card-body'>
          <div className='row d-flex justify-content-end'>
            <span
              onClick={() => onTaskCardClick(task.Task_id)}
              data-toggle='modal'
              data-target='#editTaskModal'
            >
              <i className='fa fa-list' aria-hidden='true'></i>
            </span>
          </div>
          <div className='row'>
            <span>
              <strong>Task Name: </strong>
            </span>
            <span className='card-title text-truncate pl-1'>
              {' '}
              {task.Task_name}
            </span>
          </div>

          {task.Task_plan ? (
            <div className='row'>
              <span>
                <strong>Task Plan: </strong>
              </span>{' '}
              <span className='card-title text-truncate pl-1'>
                {task.Task_plan}
              </span>
            </div>
          ) : (
            ''
          )}

          <div
            className={`row d-flex justify-content-${
              task.Task_state === 'open' || task.Task_state === 'todolist'
                ? 'end'
                : 'between'
            }`}
          >
            {task.Task_state === 'open' &&
              appState.user.userPermission.App_permit_Open && (
                <div onClick={handlePromote}>
                  <i className='fa fa-arrow-circle-right'></i>
                </div>
              )}
            {task.Task_state === 'todolist' &&
              appState.user.userPermission.App_permit_toDoList && (
                <div onClick={handlePromote}>
                  <i className='fa fa-arrow-circle-right'></i>
                </div>
              )}
            {task.Task_state === 'doing' &&
              appState.user.userPermission.App_permit_Doing && (
                <>
                  <div onClick={handleDemote}>
                    <i className='fa fa-arrow-circle-left'></i>
                  </div>
                  <div onClick={handlePromote}>
                    <i className='fa fa-arrow-circle-right'></i>
                  </div>
                </>
              )}
            {task.Task_state === 'done' &&
              appState.user.userPermission.App_permit_Done && (
                <>
                  <div onClick={handleDemote}>
                    <i className='fa fa-arrow-circle-left'></i>
                  </div>
                  <div onClick={handlePromote}>
                    <i className='fa fa-arrow-circle-right'></i>
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
