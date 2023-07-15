import React, { useState, useReducer, useEffect, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { useImmerReducer } from 'use-immer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import Axios from 'axios';
Axios.defaults.baseURL = process.env.BACKENDURL || 'https://localhost:3000/';

import StateContext from './StateContext';
import DispatchContext from './DispatchContext';

// My Components
import Header from './components/Header';
import HomeGuest from './components/HomeGuest';
import Footer from './components/Footer';
import About from './components/About';
import Terms from './components/Terms';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import ViewSinglePost from './components/ViewSinglePost';
import FlashMessage from './components/FlashMessages';
import Profile from './components/ProfileScreen';
import EditPost from './components/EditPost';
import NotFound from './components/NotFound';
// Doing Lazy Loading
// import Search from './components/Search';
// import Chat from './components/Chat';
const Search = React.lazy(() => import('./components/Search'));
const Chat = React.lazy(() => import('./components/Chat'));

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem('userToken')),
    flashMessages: [],
    user: {
      token: localStorage.getItem('userToken'),
      username: localStorage.getItem('userName'),
      avatar: localStorage.getItem('avatar'),
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case 'login':
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case 'logout':
        draft.loggedIn = false;
        return;
      case 'flashMessage':
        draft.flashMessages.push(action.value);
        return;
      case 'openSearch':
        draft.isSearchOpen = true;
        return;
      case 'closeSearch':
        draft.isSearchOpen = false;
        return;
      case 'toggleChat':
        draft.isChatOpen = !draft.isChatOpen;
        return;
      case 'closeChat':
        draft.isChatOpen = false;
        return;
      case 'incrementUnreadChatCount':
        draft.unreadChatCount++;
        return;
      case 'clearUnreadChatCount':
        draft.unreadChatCount = 0;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState);
  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem('userToken', state.user.token);
      localStorage.setItem('userName', state.user.username);
      localStorage.setItem('avatar', state.user.avatar);
    } else {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('avatar');
    }
  }, [state.loggedIn]);

  // Check if token has expired or not on first render
  useEffect(() => {
    if (state.loggedIn) {
      // Send Axios Request and cancelToken if the request halfway cancel, the 3rd argument is to cancel the request midway
      const ourRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post(
            '/checkToken',
            { token: state.user.token },
            { cancelToken: ourRequest.token }
          );
          if (!response.data) {
            dispatch({ type: 'logout' });
            dispatch({
              type: 'flashMessage',
              value: 'Your session has expired. Please log in again.',
            });
          }
        } catch (error) {
          console.log('There was a problem or the request was cancelled');
        }
      }
      fetchResults();

      // This cleanup function helps to cancel the request.
      return () => ourRequest.cancel();
    }
  }, []);
  // const [loggedIn, setLoggedIn] = useState()
  // );

  // const [FlashMessages, setFlashMessages] = useState([]);

  // function addFlashMessage(msg) {
  //   setFlashMessages((prev) => prev.concat(msg));
  // }
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessage messages={state.flashMessages} />
          <Header />
          <Routes>
            <Route
              path='/'
              element={state.loggedIn ? <Home /> : <HomeGuest />}
            />
            <Route path='/profile/:username/*' element={<Profile />} />
            <Route path='/create-post' element={<CreatePost />} />
            <Route path='/post/:id' element={<ViewSinglePost />} />
            <Route path='/post/:id/edit' element={<EditPost />} />
            <Route path='/about-us' element={<About />} />
            <Route path='/terms' element={<Terms />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames={'search-overlay'}
            unmountOnExit
          >
            <div className='search-overlay'>
              <Suspense fallback=''>
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback=''>{state.loggedIn && <Chat />}</Suspense>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}
