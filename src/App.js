import React from 'react';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import FlashMessages from './components/FlashMessage';
import Dashboard from './components/Dashboard';
import AdminPage from './components/AdminPage';
import CreateUserPage from './components/CreateUserPage';

function App() {
  return (
    <BrowserRouter>
      {/* <FlashMessage messages={state.flashMessages} /> */}
      {/* <Header /> */}
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/user/dashboard' element={<Dashboard />} />
        <Route path='/user/profile' element={<ProfilePage />} />
        <Route path='/admin/users' element={<AdminPage />} />
        <Route path='/admin/users/create' element={<CreateUserPage />} />
        {/* <Route path='/post/:id' element={<ViewSinglePost />} /> */}
        {/* <Route path='/post/:id/edit' element={<EditPost />} /> */}
        {/* <Route path='/about-us' element={<About />} /> */}
        {/* <Route path='/terms' element={<Terms />} /> */}
        {/* <Route path='*' element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
