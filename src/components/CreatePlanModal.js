import React, { useEffect, useContext, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DispatchContext from '../DispatchContext';

export default function CreatePlanModal({
  onFormSubmit,
  showModal,
  setShowModal,
}) {
  const initialState = {
    Plan_MVP_name: '',
    Plan_startDate: '',
    Plan_endDate: '',
    Plan_color: '#000000',
  };
  const [formData, setFormData] = useState(initialState);
  const params = useParams();
  const formRef = useRef(null);
  const appDispatch = useContext(DispatchContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const toggleModal = () => {
    setShowModal(!showModal);
    setFormData(initialState);
    document.body.removeAttribute('class');
    document.body.removeAttribute('style');
    document.body.removeChild(document.querySelector('.modal-backdrop'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/apps/${params.appacronym}/plans/create`,
        { ...formData, usergroup: 'admin' }
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

  // For clearing the forms after clicking out
  useEffect(() => {
    const handleModalHide = () => {
      setFormData(initialState);
    };

    // Add event listener to the modal when it's hidden (closed)
    $('#createPlanModal').on('hidden.bs.modal', handleModalHide);

    // Clean up the event listener when the component is unmounted
    return () => {
      $('#createPlanModal').off('hidden.bs.modal', handleModalHide);
    };
  }, []);

  return (
    <>
      <div
        className='modal fade'
        id='createPlanModal'
        tabindex='-1'
        role='dialog'
        aria-labelledby='createPlanModalTitle'
        aria-hidden='true'
      >
        <div
          className='modal-dialog modal-dialog-centered modal-lg'
          role='document'
        >
          <div className='modal-content'>
            <div className='modal-header p-5 bg-dark text-white'>
              <h5 className='modal-title' id='createPlanModalTitle'>
                Create Plan
              </h5>
              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
                onClick={() => setFormData(initialState)}
              >
                <span aria-hidden='true' className='text-white'>
                  &times;
                </span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className='modal-body'>
                <div className='row'>
                  <div className='col text-left p-3'>
                    <label htmlFor='Plan_MVP_name' className='form-label'>
                      <strong>Plan Name</strong>
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      name='Plan_MVP_name'
                      value={formData.Plan_MVP_name}
                      onChange={handleChange}
                      required
                    />
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
                      value={formData.Plan_startDate}
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
                      value={formData.Plan_endDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col text-left p-3'>
                    <label htmlFor='Plan_color' className='form-label'>
                      <strong>Plan Color</strong>
                    </label>
                    <input
                      type='color'
                      className='form-control'
                      name='Plan_color'
                      value={formData.Plan_color}
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
