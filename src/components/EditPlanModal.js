import React, { useEffect, useContext, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DispatchContext from '../DispatchContext';

export default function EditPlanModal({
  onFormSubmit,
  showModal,
  setShowModal,
  plans,
}) {
  const initialState = {
    Plan_MVP_name: '',
    Plan_startDate: '',
    Plan_endDate: '',
  };
  const [formData, setFormData] = useState(initialState);
  const params = useParams();
  const formRef = useRef(null);
  const appDispatch = useContext(DispatchContext);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the selected plan option is the default value
    if (value === '') {
      // Reset the form fields to initial state
      setFormData(initialState);
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
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
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
        `/apps/${params.appacronym}/plans/create`,
        formData
      );
      // Handle successful response, e.g., show a success message or perform other actions
      if (response.data.data) {
        appDispatch({
          type: 'flashMessage',
          value: 'Plan Successfully Created',
        });
        setFormData(initialState);
        onFormSubmit();
        toggleModal();
        if (formRef.current) {
          formRef.current.reset();
        }
      }
    } catch (error) {
      if (error.response.data.error.statusCode === 403) {
        appDispatch({
          type: 'flashMessageErr',
          value: error.response.data.errMessage,
        });

        navigate('/user/dashboard');
      }
      if (error.response.data) {
        appDispatch({
          type: 'flashMessageErr',
          value: error.response.data.errMessage,
        });
      }
    }
  };

  // For clearing the forms after clicking out
  useEffect(() => {
    const handleModalHide = () => {
      setFormData(initialState);
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

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        if (selectedPlan) {
          const response = await axios.get(
            `/apps/${params.appacronym}/plans/${selectedPlan}`
          );
          if (response.data.data) {
            setFormData({
              Plan_MVP_name: response.data.data[0].Plan_MVP_name,
              Plan_startDate: response.data.data[0].Plan_startDate,
              Plan_endDate: response.data.data[0].Plan_endDate,
            });
            setSelectedStartDate(response.data.data[0].Plan_startDate);
            setSelectedEndDate(response.data.data[0].Plan_endDate);
          }
          // Set the fetched plan data into the formData state to pre-fill the form
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPlanData();
  }, [selectedPlan, params.appacronym]);

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
                      class='form-control'
                      id='Task_plan'
                      name='Task_plan'
                      value={selectedPlan}
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
