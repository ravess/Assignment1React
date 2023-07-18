import React, { useState, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import Header from "./Header";
import axios from "axios";

export default function CreateUserForm() {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [useremail, setUseremail] = useState("");
  // const [isActive, setIsActive] = useState(false);
  // const [selectedUsergroups, setSelectedUsergroups] = useState([]);

  const originalState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
    },
    userpassword: {
      value: "",
      hasErrors: false,
      message: "",
    },
    useremail: {
      value: "",
    },
    userisActive: {
      value: false,
      hasErrors: false,
      message: "",
    },
    usergroups: {
      data: [],
    },
    selectedUsergroups: {
      value: "",
    },
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchUserGroup":
        draft.usergroups.data = action.data;
        return;

      case "usernameChange":
        draft.username.hasErrors = false;
        draft.username.value = action.value;
        return;
      case "userpassword":
        draft.hasErrors = false;
        draft.value = action.value;
        return;

      case "useremailChange":
        draft.value = action.value;
        return;

      case "userisActive":
        draft.userisActive.hasErrors = false;
        draft.userisActive.value = action.value;
        return;
      case "selectedUserGroup":
        draft.selectedUsergroups.hasErrors = false;
        draft.selectedUsergroups.value = action.value;
        return;
      case "usernameRules":
        if (!action.value.trim()) {
          draft.username.hasErrors = true;
          draft.username.message = "You must provide a username";
        }
        return;
      case "userpasswordRules":
        if (!action.value.trim()) {
          draft.userpassword.hasErrors = true;
          draft.userpassword.message = "You must provide a password";
        }
        return;
      case "userisActiveRules":
        if (!action.value.trim()) {
          draft.username.hasErrors = true;
          draft.username.message =
            "You must set userisActive since you are creating a user";
        }
        return;
      case "submitRequest":
        if (!draft.username.hasErrors && !draft.userpassword.hasErrors) {
          draft.sendCount++;
        }
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  useEffect(() => {
    const fetchUsergroups = async () => {
      try {
        const response = await axios.get("/admin/groups");
        if (response.data) {
          console.log(response.data.data, `fetching from database`);
          dispatch({ type: "fetchUserGroup", data: response.data.data });
        }
      } catch (error) {
        console.error("Error fetching usergroups:", error);
      }
    };

    fetchUsergroups();
  }, []);

  const handleCheckboxChange = (e) => {
    dispatch({ type: "userisActive", value: e.target.checked });
  };

  const handleSelectChange = (e) => {
    //This portions help to create an array when you select the option.value in the select so that we can use join method to become a string like
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    const joinedSelectedOptions = selectedOptions.join(",");
    dispatch({ type: "selectedUsergroup", value: joinedSelectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/admin/users/create", {});
      if (response.data) {
        console.log(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header />
      <div className="container d-flex flex-column mt-3 border border-dark rounded w-50">
        <h2>Create User</h2>
        <form className="form-group" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={state.username.value}
              onChange={(e) =>
                dispatch({ type: "usernameChange", value: e.target.value })
              }
              required
              onBlur={(e) =>
                dispatch({ type: "usernameRules", value: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={state.userpassword.value}
              onChange={(e) =>
                dispatch({ type: "userpasswordChange", value: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="useremail" className="form-label">
              Useremail
            </label>
            <input
              type="email"
              className="form-control"
              id="useremail"
              value={state.useremail.value}
              onChange={(e) =>
                dispatch({ type: "useremailChange", value: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3 form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="isActive"
              checked={state.userisActive.value}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="isActive">
              Active
            </label>
          </div>
          <div className="mb-3 d-flex flex-column">
            <label htmlFor="usergroups" className="form-label">
              Usergroups
            </label>
            <select
              multiple
              className="form-select"
              id="usergroups"
              onChange={handleSelectChange}
            >
              {state.usergroups.data.map((group) => {
                return (
                  <option key={group.groupid} value={group.groupname}>
                    {group.groupname}
                  </option>
                );
              })}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled>
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}
