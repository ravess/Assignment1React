import React from "react";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import FlashMessages from "./components/FlashMessage";
import FlashMessagesErr from "./components/FlashMessageErr";
import Dashboard from "./components/Dashboard";
import AdminPage from "./components/AdminPage";
import AdminUpdateUserPage from "./components/AdminUpdateUserPage";
import CreateUserPage from "./components/CreateUserPage";
import CreateAppPage from "./components/CreateAppPage";
import Header from "./components/Header";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import axios from "axios";
import AppPage from "./components/AppPage";
import KanbanBoard from "./components/KanbanBoard";
axios.defaults.baseURL = process.env.BACKENDURL;
axios.defaults.withCredentials = true;

export default function App() {
  const initialState = {
    loggedIn: false,
    flashMessages: [],
    flashMessagesErr: [],
    user: {
      username: "",
      usergroups: "",
      userisActive: "",
      useremail: "",
      userisAdmin: false,
      userisPm: false,
      userisPl: false,
      userPermission: {},
    },
  };
  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        return;
      case "isAuth":
        draft.loggedIn = true;
        draft.user = { ...draft.user, ...action.data };
        return;
      case "logout":
        draft.loggedIn = false;
        draft.user = { ...initialState.user };
        return;
      case "isAdmin":
        draft.user.userisAdmin = action.value;
        return;
      case "isPm":
        draft.user.userisPm = action.value;
        return;
      case "isPl":
        draft.user.userisPl = action.value;
        return;
      case "setPermission":
        draft.user.userPermission = action.data;
        return;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        return;
      case "flashMessageErr":
        draft.flashMessagesErr.push(action.value);
        return;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          {state.loggedIn ? <Header /> : ""}
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/user/dashboard" element={<Dashboard />} />
            <Route path="/user/profile" element={<ProfilePage />} />
            <Route path="/admin/users" element={<AdminPage />} />
            <Route
              path="/admin/users/:userid/edit"
              element={<AdminUpdateUserPage />}
            />
            <Route path="/admin/users/create" element={<CreateUserPage />} />
            <Route path="/apps" element={<AppPage />} />
            <Route path="/apps/:appacronym" element={<KanbanBoard />} />
            <Route path="/apps/create" element={<CreateAppPage />} />
            <Route
              path="*"
              element={state.loggedIn ? <Dashboard /> : <LoginPage />}
            />
          </Routes>
          <FlashMessages messages={state.flashMessages} />
          <FlashMessagesErr messages={state.flashMessagesErr} />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
