import React from 'react';

export default function TaskCard({ task, handleMoveLeft, handleMoveRight }) {
  return (
    <>
      <div className='card' data-toggle='modal' data-target='#editTaskModal'>
        <div className='card-body'>
          <h5 className='card-title'>{task.Task_name}</h5>
          <button
            className='btn btn-dark'
            onClick={() => handleMoveLeft(task.Task_id)}
          >
            &larr; Left
          </button>
          <button
            className='btn btn-dark'
            onClick={() => handleMoveRight(task.Task_id)}
          >
            Right &rarr;
          </button>
        </div>
      </div>
    </>
  );
}
