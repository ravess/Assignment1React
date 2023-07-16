import React from 'react';
import Header from './Header';

export default function AdminPage({ username }) {
  return (
    <>
      <Header />
      <h1>
        Placeholder for getalluser with modify buttons here and create user
        button here
      </h1>
      <div>
        <button>Modify</button>
        <button>Create User</button>
      </div>
      {/* Add more dashboard content here */}
    </>
  );
}
