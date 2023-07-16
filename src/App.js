import React, { useContext, useReducer } from 'react';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import FlashMessages from './components/FlashMessage';
import Dashboard from './components/Dashboard';
import AdminPage from './components/AdminPage';
import CreateUserPage from './components/CreateUserPage';
import StateContext from './StateContext';
import DispatchContext from './DispatchContext';

export default function App() {
  const initialState = {
    isloggedIn: false,
    flashMessages: [],
    user: {
      token: '',
      username: '',
      usergroup: '',
    },
  };
  function ourReducer(state, action) {
    switch (action.type) {
      case 'login':
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case 'logout':
        draft.loggedIn = false;
        return;
      // case 'flashMessage':
      //   draft.flashMessages.push(action.value);
      //   return;
      // case 'openSearch':
      //   draft.isSearchOpen = true;
      //   return;
      // case 'closeSearch':
      //   draft.isSearchOpen = false;
      //   return;
      // case 'toggleChat':
      //   draft.isChatOpen = !draft.isChatOpen;
      //   return;
      // case 'closeChat':
      //   draft.isChatOpen = false;
      //   return;
      // case 'incrementUnreadChatCount':
      //   draft.unreadChatCount++;
      //   return;
      // case 'clearUnreadChatCount':
      //   draft.unreadChatCount = 0;
    }
  }
  const [state, dispatch] = useReducer(ourReducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
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
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
