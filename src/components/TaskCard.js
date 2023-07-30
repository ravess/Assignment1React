import React from 'react';

export default function TaskCard({
  task,
  handleMoveLeft,
  handleMoveRight,
  onTaskCardClick,
}) {
  const handleClickLeft = (e) => {
    e.stopPropagation();
    handleMoveLeft(task.Task_id);
  };
  const handleClickRight = (e) => {
    e.stopPropagation();
    handleMoveRight(task.Task_id);
  };
  return (
    <>
      <div
        className='card my-3'
        data-toggle='modal'
        data-target='#editTaskModal'
        onClick={() => onTaskCardClick(task.Task_id)}
      >
        <div className='card-body'>
          <h5 className='card-title'>{task.Task_name}</h5>
          <button className='btn btn-outline-dark' onClick={handleClickLeft}>
            &larr; Left
          </button>
          <button className='btn btn-outline-dark' onClick={handleClickRight}>
            Right &rarr;
          </button>
        </div>
      </div>
    </>
  );
}
