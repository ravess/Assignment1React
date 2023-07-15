import React, { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import { Tooltip as ReactToolTip } from 'react-tooltip';

export default function HeaderLoggedIn() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  function handleLogOut() {
    appDispatch({ type: 'logout' });
    appDispatch({
      type: 'flashMessage',
      value: "You've Logged Out SuccessFully",
    });
    navigate('/');
  }

  function handleSearchIcon(e) {
    e.preventDefault();
    appDispatch({ type: 'openSearch' });
  }

  return (
    <div className='flex-row my-3 my-md-0'>
      <a
        data-tooltip-id='search'
        data-tooltip-content='search'
        onClick={handleSearchIcon}
        href='#'
        className='text-white mr-2 header-search-icon'
      >
        <i className='fas fa-search'></i>
      </a>
      <ReactToolTip place='bottom' id='search' className='custom-tooltip' />{' '}
      <span
        onClick={() => appDispatch({ type: 'toggleChat' })}
        data-tooltip-id='chat'
        data-tooltip-content='Chat'
        className={
          'mr-2 header-chat-icon ' +
          (appState.unreadChatCount ? 'text-danger' : 'text-white')
        }
      >
        <i className='fas fa-comment'></i>
        {appState.unreadChatCount ? (
          <span className='chat-count-badge text-white'>
            {appState.unreadChatCount < 10 ? appState.unreadChatCount : '9+'}
          </span>
        ) : (
          ''
        )}
      </span>
      <ReactToolTip place='bottom' id='chat' className='custom-tooltip' />{' '}
      <Link
        data-tooltip-id='profile'
        data-tooltip-content='Profile'
        to={`/profile/${appState.user.username}`}
        className='mr-2'
      >
        <img
          className='small-header-avatar'
          src={localStorage.getItem('avatar')}
        />
      </Link>{' '}
      <ReactToolTip place='bottom' id='profile' className='custom-tooltip' />
      <Link className='btn btn-sm btn-success mr-2' to='/create-post'>
        Create Post
      </Link>{' '}
      <button onClick={handleLogOut} className='btn btn-sm btn-secondary'>
        Sign Out
      </button>
    </div>
  );
}
