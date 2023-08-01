import React, { useEffect, useContext, useState } from "react";
import DispatchContext from "../DispatchContext";
import axios from "axios";
import EditAppModal from "./EditAppModal";
import { useNavigate, Link } from "react-router-dom";

export default function AppPage() {
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [key, setKey] = useState(0);
  const [selectedAppAcronym, setSelectedAppAcronym] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleView = (appacronym) => {
    navigate(`/apps/${appacronym}`);
  };
  const handleEdit = (appacronym) => {
    setShowModal(true);
    setSelectedAppAcronym(appacronym);
    setKey((prevKey) => prevKey + 1);
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
          <div className="table-responsive mt-2 mb-5">
            <table className="table table-bordered table-shadow mb-0">
              <thead>
                <tr>
                  <th className="bg-dark text-white">App Name</th>
                  <th className="bg-dark text-white">App Start Date</th>
                  <th className="bg-dark text-white">App End Date</th>
                  <th className="bg-dark text-white">App Description</th>
                  <th className="bg-dark text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "even-row" : "odd-row"}
                  >
                    {/* <Link
                      to={`/apps/${app.App_Acronym}`}
                      style={linkStyle}
                      key={app.id}
                    > */}
                    <td>{app.App_Acronym}</td>
                    {/* </Link> */}
                    <td>{app.App_startDate}</td>
                    <td>{app.App_endDate}</td>
                    <td>{app.App_Description}</td>
                    <td className="d-flex justify-content-center">
                      <button
                        className="btn btn-outline-dark text-center mr-2"
                        style={{ width: "60px" }}
                        onClick={() => handleView(app.App_Acronym)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-outline-dark text-center "
                        style={{ width: "60px" }}
                        onClick={() => handleEdit(app.App_Acronym)}
                        data-toggle="modal"
                        data-target="#editAppModal"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            {showModal && (
              <>
                <EditAppModal
                  selectedAppAcronym={selectedAppAcronym}
                  key={key}
                  onFormSubmit={() => setIsTaskFormSubmitted(true)}
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
