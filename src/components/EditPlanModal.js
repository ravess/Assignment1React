import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DispatchContext from '../DispatchContext';

export default function EditPlanModal({
  onFormSubmit,
  showModal,
  setShowModal,
  plans,
}) {
  const params = useParams();
  const appDispatch = useContext(DispatchContext);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Check if the selected plan option is the default value
    if (value === '') {
      // Reset the form fields to initial state
      setSelectedPlan(value); // Reset selected plan to the default value
      setSelectedStartDate('');
      setSelectedEndDate('');
    } else if (name === 'Task_plan') {
      setSelectedPlan(value);
    } else if (name === 'Plan_startDate') {
      setSelectedStartDate(value);
    } else if (name === 'Plan_endDate') {
      setSelectedEndDate(value);
    } else {
      console.log(`hi`);
    }
  };
  const toggleModal = () => {
    setShowModal(!showModal);
    document.body.removeAttribute('class');
    document.body.removeAttribute('style');
    document.body.removeChild(document.querySelector('.modal-backdrop'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formObj = {
      Plan_startDate: selectedStartDate,
      Plan_endDate: selectedEndDate,
    };
    try {
      const response = await axios.put(
        `/apps/${params.appacronym}/plans/${selectedPlan}/edit`,
        { ...formObj, usergroup: 'pm' }
      );
      // Handle successful response, e.g., show a success message or perform other actions
      if (response.data.data) {
        appDispatch({
          type: 'flashMessage',
          value: 'Plan Successfully Updated',
        });
        setSelectedPlan('');
        setSelectedStartDate('');
        setSelectedEndDate('');
        onFormSubmit();
        toggleModal();
      }
    } catch (error) {
      if (error.response && error.response.data.error.statusCode === 401) {
        appDispatch({
          type: 'flashMessageErr',
          value: error.response.data.errMessage,
        });
        toggleModal();
        navigate(`/apps/${params.appacronym}`);
      }
      if (error.response && error.response.data.error.statusCode === 403) {
        appDispatch({ type: 'logout' });
        appDispatch({
          type: 'flashMessageErr',
          value: error.response.data.errMessage,
        });
        toggleModal();
        navigate('/');
      }
      if (error.response && error.response.data)
        appDispatch({
          type: 'flashMessageErr',
          value: error.response.data.errMessage,
        });
    }
  };

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        if (selectedPlan) {
          const response = await axios.get(
            `/apps/${params.appacronym}/plans/${selectedPlan}`
          );
          if (response.data.data) {
            setSelectedStartDate(response.data.data[0].Plan_startDate);
            setSelectedEndDate(response.data.data[0].Plan_endDate);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlanData();
  }, [selectedPlan, params.appacronym]);

  // For clearing the forms after clicking out
  useEffect(() => {
    const handleModalHide = () => {
      setSelectedPlan('');
      setSelectedEndDate('');
      setSelectedStartDate('');
    };
    // Add event listener to the modal when it's hidden (closed)
    $('#editPlanModal').on('hidden.bs.modal', handleModalHide);
    // Clean up the event listener when the component is unmounted
    return () => {
      $('#editPlanModal').off('hidden.bs.modal', handleModalHide);
    };
  }, []);

  return (
    <>
      <div
        className='modal fade'
        id='editPlanModal'
        tabindex='-1'
        role='dialog'
        aria-labelledby='editPlanModalTitle'
        aria-hidden='true'
      >
        <div
          className='modal-dialog modal-dialog-centered modal-lg'
          role='document'
        >
          <div className='modal-content'>
            <div className='modal-header p-5 bg-dark text-white'>
              <h5 className='modal-title' id='editPlanModalTitle'>
                Edit Plan
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
            <form onSubmit={handleSubmit}>
              <div className='modal-body'>
                <div className='row'>
                  <div className='col form-group text-left'>
                    <label htmlFor='Task_plan'>
                      <strong>Select a Plan:</strong>
                    </label>
                    <select
                      className='form-control'
                      id='Task_plan'
                      name='Task_plan'
                      value={selectedPlan}
                      onChange={handleChange}
                      required
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

                <div className='row'>
                  <div className='col text-left p-3'>
                    <label htmlFor='Plan_startDate' className='form-label'>
                      <strong>Start Date</strong>
                    </label>
                    <input
                      type='date'
                      className='form-control'
                      name='Plan_startDate'
                      value={selectedStartDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='col text-left p-3'>
                    <label htmlFor='Plan_endDate' className='form-label'>
                      <strong>End Date</strong>
                    </label>
                    <input
                      type='date'
                      className='form-control'
                      name='Plan_endDate'
                      value={selectedEndDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  data-dismiss='modal'
                >
                  Close
                </button>
                <button type='submit' className='btn btn-dark'>
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
