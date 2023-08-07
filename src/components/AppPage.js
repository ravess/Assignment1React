import React, { useEffect, useContext, useState } from 'react';
import DispatchContext from '../DispatchContext';
import axios from 'axios';
import EditAppModal from './EditAppModal';
import { useNavigate } from 'react-router-dom';
import StateContext from '../StateContext';

export default function AppPage() {
  const linkStyle = {
    maxWidth: '250px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [key, setKey] = useState(0);
  const [selectedAppAcronym, setSelectedAppAcronym] = useState(null);
  const [isAppFormSubmitted, setIsAppFormSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleView = (appacronym) => {
    navigate(`/apps/${appacronym}`);
  };
  const handleEdit = async (appacronym) => {
    // try {
    //   const response = await axios.post("/checkgroup", { usergroup: "pl" });
    //   if (response.data.data === 1) {
    //     appDispatch({ type: "isPl", value: true });
    //   }
    // } catch (error) {
    //   appDispatch({ type: "isPl", value: false });
    //   setShowModal(false);
    //   setSelectedAppAcronym(null);
    //   setKey(prevKey);
    //   appDispatch({ type: "flashMessageErr", value: "You are not authorised" });
    // }
    // if (appState.user.userisPl) {
    //   setShowModal(true);
    //   setSelectedAppAcronym(appacronym);
    //   setKey((prevKey) => prevKey + 1);
    // }
    setShowModal(true);
    setSelectedAppAcronym(appacronym);
    setKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    console.log(`useeffect in app page ran again`);
    const checkPL = async () => {
      try {
        const responsePl = await axios.post('/checkgroup', {
          usergroup: 'pl',
        });
        if (responsePl.data.data === 1) {
          appDispatch({ type: 'isPl', value: true });
        }
      } catch (error) {
        // Might have issue with other error handler
        if (error.response && error.response.data.error.statusCode === 401) {
          // appDispatch({
          //   type: "flashMessageErr",
          //   value: error.response.data.errMessage,
          // });
          appDispatch({ type: 'isPl', value: false });
          //navigate("/apps/");
        } else if (
          error.response &&
          error.response.data.error.statusCode === 403
        ) {
          appDispatch({ type: 'logout' });
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
          navigate('/');
        } else if (error.response && error.response.data)
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
      }
    };
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/user/profile');
        if (response.data.data[0]) {
          appDispatch({ type: 'isAuth', data: response.data.data[0] });
        }
        console.log(`it trigger the fetchprofile`);
      } catch (error) {
        if (error.response && error.response.data.error.statusCode === 401) {
          // appDispatch({
          //   type: "flashMessageErr",
          //   value: error.response.data.errMessage,
          // });
          //navigate("/apps/");
        } else if (
          error.response &&
          error.response.data.error.statusCode === 403
        ) {
          appDispatch({ type: 'logout' });
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
          navigate('/');
        } else if (error.response && error.response.data)
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
      }
    };
    const fetchAllApps = async () => {
      try {
        const response = await axios.get('/apps');
        if (response.data.data) {
          setApps(response.data.data);
        }
      } catch (error) {
        if (error.response && error.response.data.error.statusCode === 401) {
          // appDispatch({
          //   type: "flashMessageErr",
          //   value: error.response.data.errMessage,
          // });
          //navigate("/apps/");
        } else if (
          error.response &&
          error.response.data.error.statusCode === 403
        ) {
          appDispatch({ type: 'logout' });
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
          navigate('/');
        } else if (error.response && error.response.data)
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
      }
    };
    checkPL();
    fetchProfile();
    fetchAllApps();
    return () => ourRequest.cancel();
  }, []);

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    const checkPL = async () => {
      try {
        const responsePl = await axios.post('/checkgroup', {
          usergroup: 'pl',
        });
        if (responsePl.data.data === 1) {
          appDispatch({ type: 'isPl', value: true });
        }
      } catch (error) {
        // Might have issue with other error handler
        if (error.response && error.response.data.error.statusCode === 401) {
          // appDispatch({
          //   type: "flashMessageErr",
          //   value: error.response.data.errMessage,
          // });
          appDispatch({ type: 'isPl', value: false });
          //navigate("/apps/");
        } else if (
          error.response &&
          error.response.data.error.statusCode === 403
        ) {
          appDispatch({ type: 'logout' });
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
          navigate('/');
        } else if (error.response && error.response.data)
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
      }
    };
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/user/profile');
        if (response.data.data[0]) {
          appDispatch({ type: 'isAuth', data: response.data.data[0] });
        }
      } catch (error) {
        if (error.response && error.response.data.error.statusCode === 401) {
          // appDispatch({
          //   type: "flashMessageErr",
          //   value: error.response.data.errMessage,
          // });
          //navigate("/apps/");
        } else if (
          error.response &&
          error.response.data.error.statusCode === 403
        ) {
          appDispatch({ type: 'logout' });
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
          navigate('/');
        } else if (error.response && error.response.data)
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
      }
    };

    const fetchAllApps = async () => {
      try {
        if (isAppFormSubmitted) {
          const getAllAppResponse = await axios.get('/apps');
          if (getAllAppResponse.data.data) {
            setApps(getAllAppResponse.data.data);
            setIsAppFormSubmitted(false);
          }
        }
      } catch (error) {
        if (error.response.data) {
          appDispatch({
            type: 'flashMessageErr',
            value: error.response.data.errMessage,
          });
          console.log(`either navigate away or do other things`);
        }
      }
    };
    checkPL();
    fetchProfile();
    fetchAllApps();
    return () => ourRequest.cancel();
  }, [isAppFormSubmitted]);

  return (
    <div className='dashboard'>
      <div className='ml-5 mt-3' onClick={() => navigate(-1)}>
        <i
          className='fa fa-arrow-left fa-2x align-self-center'
          aria-hidden='true'
          style={{ cursor: 'pointer' }}
        ></i>
      </div>
      <div className='container-fluid text-center'>
        <p className='dashboard__description text-center'>All Available Apps</p>
        {appState.user.userisPl && (
          <div className='d-flex justify-content-center mb-2'>
            <button
              className='btn btn-outline-dark mt-2 mr-2'
              onClick={() => {
                navigate('/apps/create');
              }}
            >
              <i className='fas fa-plus'></i> Create App
            </button>
          </div>
        )}

        <div
          className='container-fluid row justify-content-center d-inline-flex mt-5 mx-auto'
          style={{ height: '70vh', overflowY: 'auto' }}
        >
          <div className='table-responsive mt-2 mb-5'>
            <table className='table table-bordered table-shadow mb-0'>
              <thead>
                <tr>
                  <th className='bg-dark text-white'>App Name</th>
                  <th className='bg-dark text-white'>App Start Date</th>
                  <th className='bg-dark text-white'>App End Date</th>
                  <th className='bg-dark text-white' style={linkStyle}>
                    App Description
                  </th>
                  <th className='bg-dark text-white'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'even-row' : 'odd-row'}
                  >
                    <td>{app.App_Acronym}</td>
                    <td>{app.App_startDate}</td>
                    <td>{app.App_endDate}</td>
                    <td className='text-truncate' style={linkStyle}>
                      {app.App_Description}
                    </td>
                    <td className='d-flex justify-content-center'>
                      <button
                        className='btn btn-outline-dark text-center mr-2'
                        style={{ width: '60px' }}
                        onClick={() => handleView(app.App_Acronym)}
                      >
                        View
                      </button>
                      {appState.user.userisPl && (
                        <button
                          className='btn btn-outline-dark text-center '
                          style={{ width: '60px' }}
                          onClick={() => handleEdit(app.App_Acronym)}
                          data-toggle='modal'
                          data-target='#editAppModal'
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            {showModal && appState.user.userisPl && (
              <>
                <EditAppModal
                  selectedAppAcronym={selectedAppAcronym}
                  key={key}
                  onFormSubmit={() => setIsAppFormSubmitted(true)}
                  showModal={showModal}
                  setShowModal={setShowModal}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
