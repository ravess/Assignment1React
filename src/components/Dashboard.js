import React, { useContext, useEffect } from "react";
import Header from "./Header";
import "./Dashboard.css"; // Import your custom CSS file
import StateContext from "../StateContext";
import DispatchContext from "../StateContext";
import axios from "axios";

export default function Dashboard() {
  const appState = useContext(StateContext);

  // useEffect(() => {
  //   const ourRequest = axios.CancelToken.source();
  //   async function fetchResults() {
  //     try {
  //       dispatch({ type: "loadingSpinning" });
  //       const response = await axios.get("/user/profile");
  //       if (response.data.data[0]) {
  //         dispatch({ type: "loadingSpinning" });
  //         dispatch({ type: "refreshCookie", data: response.data.data[0] });
  //         // dispatch({ type: "login" });
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchResults();
  //   return () => ourRequest.cancel();
  // }, [appState.user]);

  return (
    <>
      <div>
        <Header />
        <div className="dashboard">
          <div className="container">
            <h5 className="dashboard__title">
              Welcome, {appState.user.username}!
            </h5>
            <p className="dashboard__description">
              This is your dashboard. Enjoy your stay.
            </p>
          </div>
        </div>
        <div className="container d-flex"></div>
        <div className="card w-25">
          <div className="card-body bg-dark">
            <h5 className="card-title text-white text-center">Profile:</h5>
            <h4 className="card-title text-white">
              Username: {appState.user.username}
            </h4>
            <h4 className="card-title text-white">
              Email: {appState.user.useremail}
            </h4>
            <h4 className="card-title text-white">
              Status:{appState.user.userisActive ? "🟢" : "🔴"}
            </h4>
          </div>
        </div>
      </div>
    </>
  );
}
