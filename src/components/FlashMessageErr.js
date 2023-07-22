import React from 'react';
import './FlashMessage.css';

export default function FlashMessagesErr({ messages }) {
  return (
    <div className='floating-alerts'>
      {messages.map((msg, index) => {
        return (
          <div
            key={index}
            className='alert alert-danger text-center floating-alert shadow-sm'
          >
            {msg}
          </div>
        );
      })}
    </div>
  );
}
