import React, { useEffect, useContext, useState } from "react";
import DispatchContext from "../DispatchContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function AppPage() {
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const linkStyle = {
    textDecoration: "none",
    color: "inherit",
  };

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/user/profile");
        if (response.data.data[0]) {
          appDispatch({ type: "isAuth", data: response.data.data[0] });
        }
      } catch (error) {
        if (error.response.data) {
          appDispatch({
            type: "flashMessageErr",
            value: error.response.data.errMessage,
          });
          navigate("/");
        }
      }
    };
    const fetchApp = async () => {
      try {
        const response = await axios.get("/apps");
        if (response.data.data) {
          setApps(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchApp();
    fetchProfile();
    return () => ourRequest.cancel();
  }, []);
  return (
    <div className="dashboard">
      <div className="ml-5 mt-3" onClick={() => navigate(-1)}>
        <i
          class="fa fa-arrow-left fa-2x align-self-center"
          aria-hidden="true"
          style={{ cursor: "pointer" }}
        ></i>
      </div>
      <div className="container-fluid text-center">
        <p className="dashboard__description text-center">All Available Apps</p>
        <div className="d-flex justify-content-center mb-2">
          <button
            className="btn btn-outline-dark mt-2 mr-2"
            onClick={() => {
              navigate("/apps/create");
            }}
          >
            <i class="fas fa-plus"></i> Create App
          </button>
        </div>

        <div className="container-fluid row justify-content-center d-inline-flex mt-5 mx-auto">
          {apps.map((app) => (
            <Link
              to={`/apps/${app.App_Acronym}`}
              className="col-md-4 mb-4"
              style={linkStyle}
              key={app.id}
            >
              <div className="card m-auto h-100">
                <div className="card-body bg-dark">
                  <h5 className="card-title text-white text-left">
                    App: {app.App_Acronym}
                  </h5>
                  <p className="card-title text-white text-left">
                    Start Date: {app.App_startDate}
                  </p>
                  <p className="card-title text-white text-left">
                    End Date: {app.App_endDate}
                  </p>
                  <p className="card-title text-white text-left">
                    Description: {app.App_Description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
