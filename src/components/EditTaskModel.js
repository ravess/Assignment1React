import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function EditTaskModel({ selectedTaskId, key }) {
  const [task, setTask] = useState([]);

  const params = useParams();

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
          console.log(getTasksResponse.data.data);
          setTask(getTasksResponse.data.data);
        }
      } catch (error) {
        if (error.response && error.response.data) {
          appDispatch({
            type: 'flashMessageErr',
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
        className='modal fade'
        id='editTaskModal'
        key={key}
        tabindex='-1'
        role='dialog'
        aria-labelledby='editTaskModalTitle'
        aria-hidden='true'
      >
        <div
          className='modal-dialog modal-dialog-centered modal-lg'
          role='document'
        >
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='editTaskModalTitle'>
                Edit Task
              </h5>

              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              <form>
                <div className='form-group'>
                  <label htmlFor='taskname' className='form-label' re>
                    Name:
                  </label>
                  <input type='text' className='form-control' required />
                </div>
                <div className='form-group'>
                  <label htmlFor='username' className='form-label'>
                    Description:
                  </label>
                  <input type='text' className='form-control' />
                </div>
                <div className='form-group'>
                  <label htmlFor='username' className='form-label'>
                    Notes:
                  </label>
                  <textarea
                    class='form-control'
                    id='exampleFormControlTextarea1'
                    rows='3'
                  ></textarea>
                </div>
                <div class='form-group'>
                  <label for='exampleFormControlSelect1'>Plan</label>
                  <select class='form-control' id='exampleFormControlSelect1'>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                </div>
              </form>
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-dark'
                data-dismiss='modal'
              >
                Close
              </button>
              <button type='button' className='btn btn-dark'>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
