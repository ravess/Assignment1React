import React, { useContext } from "react";
import Header from "./Header";
import "./Dashboard.css"; // Import your custom CSS file
import StateContext from "../StateContext";

export default function Dashboard() {
  const appState = useContext(StateContext);
  return (
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

          {/* Add more dashboard content here */}
        </div>
      </div>
    </div>
  );
}
