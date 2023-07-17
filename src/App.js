import React, { useEffect, useState } from "react";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import FlashMessages from "./components/FlashMessage";
import Dashboard from "./components/Dashboard";
import AdminPage from "./components/AdminPage";
import CreateUserPage from "./components/CreateUserPage";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import axios from "axios";
axios.defaults.baseURL = process.env.BACKENDURL;
axios.defaults.withCredentials = true;

export default function App() {
  const initialState = {
    loggedIn: false,
    flashMessages: [],
    user: {
      username: "",
      usergroup: "",
      token: "",
    },
    isLoading: true,
  };
  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        console.log(`it fire off login`);
        return;
      case "isAuth":
        draft.user = action.data;
        return;
      case "logout":
        draft.loggedIn = false;
        draft.user.username = "";
        draft.user.usergroup = "";
        draft.user.token = "";
        return;
      case "refreshCookie":
        draft.loggedIn = true;
        draft.user = action.data;
        draft.isLoading = !draft.isLoading;
        return;
      case "loadingSpinning":
        draft.isLoading = !draft.isLoading;
      // case 'flashMessage':
      //   draft.flashMessages.push(action.value);
      //   return;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  // Check if cookie is present previously when you refresh the component renders on mount
  useEffect(() => {
    async function fetchResults() {
      try {
        dispatch({ type: "loadingSpinning" });
        const response = await axios.get("/user/profile");
        if (response.data.data[0]) {
          dispatch({ type: "loadingSpinning" });
          dispatch({ type: "refreshCookie", data: response.data.data[0] });
          // dispatch({ type: "login" });
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchResults();
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          {/* <FlashMessage messages={state.flashMessages} /> */}
          {/* <Header /> */}
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/user/dashboard" element={<Dashboard />} />
            <Route path="/user/profile" element={<ProfilePage />} />
            <Route path="/admin/users" element={<AdminPage />} />
            <Route path="/admin/users/create" element={<CreateUserPage />} />
          </Routes>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
