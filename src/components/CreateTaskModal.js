import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import axios from 'axios';

export default function CreateTaskModal({
  plans,
  onFormSubmit,
  showModal,
  setShowModal,
}) {
  const initialState = {
    Task_name: '',
    Task_description: '',
    Task_notes: '',
    Task_plan: '',
  };
  const [formData, setFormData] = useState(initialState);
  const appDispatch = useContext(DispatchContext);
  const params = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const toggleModal = () => {
    setShowModal(!showModal);
    document.body.classList.toggle('modal-open');
    document.body.removeChild(document.querySelector('.modal-backdrop'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/apps/${params.appacronym}/tasks/create`,
        formData
      );
      // Handle successful response, e.g., show a success message or perform other actions
      if (response.data.data) {
        appDispatch({
          type: 'flashMessage',
          value: 'Task Successfully Created',
        });
        setFormData(initialState);
        onFormSubmit();
        toggleModal();
        if (formRef.current) {
          formRef.current.reset();
        }
      }
    } catch (error) {
      if (error.response && error.response.data.error.statusCode === 403) {
        appDispatch({
          type: 'flashMessageErr',
          value: error.response.data.errMessage,
        });
        navigate('/user/dashboard');
      }
      if (error.response && error.response.data) {
        appDispatch({
          type: 'flashMessageErr',
          value: error.response.data.errMessage,
        });
      }
    }
  };

  useEffect(() => {
    const handleModalHide = () => {
      setFormData(initialState);
    };

    // Add event listener to the modal when it's hidden (closed)
    $('#createTaskModal').on('hidden.bs.modal', handleModalHide);

    // Clean up the event listener when the component is unmounted
    return () => {
      $('#createTaskModal').off('hidden.bs.modal', handleModalHide);
    };
  }, []);

  return (
    <>
      <div
        className='modal fade'
        id='createTaskModal'
        tabIndex='-1'
        role='dialog'
        aria-labelledby='createTaskModalTitle'
        aria-hidden='true'
      >
        <div
          className='modal-dialog modal-dialog-centered modal-lg'
          role='document'
        >
          <div className='modal-content'>
            <div className='modal-header p-5 bg-dark text-white '>
              <h5 className='modal-title' id='createTaskModalTitle'>
                Create Task Details
              </h5>

              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true' className='text-white'>
                  &times;
                </span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className='p-3'>
              <div className='modal-body'>
                <div className='form-group text-left'>
                  <label htmlFor='Task_name' className='form-label'>
                    <strong>Task Name:</strong>
                  </label>
                  <input
                    type='text'
                    id='Task_name'
                    className='form-control'
                    value={formData.Task_name}
                    name='Task_name'
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className='form-group text-left'>
                  <label htmlFor='Task_description' className='form-label'>
                    <strong>Task Description:</strong>
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    id='Task_description'
                    value={formData.Task_description}
                    name='Task_description'
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className='form-group text-left'>
                  <label htmlFor='Task_notes' className='form-label'>
                    <strong>
                      <p>Task Notes:</p>
                    </strong>
                  </label>
                  <textarea
                    class='form-control'
                    id='Task_notes'
                    rows='10'
                    name='Task_notes'
                    value={formData.Task_notes}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div class='form-group text-left'>
                  <label htmlFor='Task_plan' className='form-label'>
                    <strong>Task Plans</strong>
                  </label>
                  <select
                    className='form-control'
                    id='Task_plan'
                    name='Task_plan'
                    onChange={handleChange}
                  >
                    <option value=''>Select a Plan</option>
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
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  data-dismiss='modal'
                  onClick={() => setFormData(initialState)}
                >
                  Close
                </button>
                <button type='submit' className='btn btn-dark'>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
