import React, { useEffect, useContext } from 'react';

export default function CreatePlanModel() {
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
            <div className='modal-header'>
              <h5 className='modal-title' id='createPlanModalTitle'>
                Create Plan
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
                <div className='row'>
                  <div className='col'>
                    <label htmlFor='planmvpname' className='form-label' re>
                      Plan_MVP_name
                    </label>
                    <input type='text' className='form-control' required />
                  </div>
                  <div className='col'>
                    <label htmlFor='username' className='form-label'>
                      Plan Start Date
                    </label>
                    <input type='date' className='form-control' />
                    <label htmlFor='username' className='form-label'>
                      Plan End Date
                    </label>
                    <input type='date' className='form-control' />
                  </div>
                </div>
              </form>
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
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
