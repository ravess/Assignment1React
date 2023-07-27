import React, { useEffect, useContext } from 'react';

export default function CreateTaskModel() {
  return (
    <>
      <div
        className='modal fade bd-example-modal-lg'
        id='createTaskModal'
        tabindex='-1'
        role='dialog'
        aria-labelledby='createTaskModalTitle'
        aria-hidden='true'
      >
        <div
          className='modal-dialog modal-dialog-centered modal-lg'
          role='document'
        >
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='createTaskModalTitle'>
                Create Task
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
            <div className='modal-body'></div>
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
