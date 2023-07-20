import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import { useImmerReducer } from "use-immer";
import LoadingSpinner from "./LoadingSpinner";

export default function EditUserForm() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const [userh1, setUserh1] = useState("");
  const { userid } = useParams();
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
      value: true,
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
      case "fetchUserGroupData":
        draft.usergroups.data = action.data;
        return;
      case "fetchUserData":
        draft.useremail.value = action.data.useremail;
        draft.userisActive.value = action.data.userisActive;
        draft.selectedUsergroups.value = action.data.usergroup;
        setUserh1(action.data.username);
        return;
      case "userpasswordChange":
        draft.userpassword.hasErrors = false;
        draft.userpassword.value = action.value;
        return;

      case "useremailChange":
        draft.useremail.value = action.value;
        return;

      case "userisActive":
        draft.userisActive.hasErrors = false;
        draft.userisActive.value = action.value;
        return;
      case "selectedUsergroups":
        draft.selectedUsergroups.hasErrors = false;
        draft.selectedUsergroups.value = action.value;

        return;
      case "userpasswordRules":
        const rePassword = new RegExp(
          "^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,10}$"
        );
        if (!rePassword.test(action.value) && action.value) {
          console.log(`it is in password rules`);
          draft.userpassword.hasErrors = true;
          draft.userpassword.message =
            "Your Password is required and alphanumeric min8 chars, max10chars with special chars.";
        } else {
          draft.userpassword.hasErrors = false;
        }
        return;

      case "submitRequest":
        if (!draft.userpassword.hasErrors) {
          (draft.userpassword.value = ""),
            (draft.selectedUsergroups.value = ""),
            (draft.useremail.value = ""),
            (draft.userisActive.value = true);
        }
        return;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  const handleCurrentRoleChange = (e) => {
    //This portions help to create an array when you select the option.value in the select so that we can use join method to become a string like
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    const joinedSelectedOptions = selectedOptions.join(",");
    dispatch({ type: "selectedUsergroups", value: joinedSelectedOptions });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      appDispatch({ type: "loadingSpinning" });
      const user = {
        userpassword: state.userpassword.value,
        useremail: state.useremail.value,
        userisActive: state.userisActive.value,
        usergroup: state.selectedUsergroups.value,
      };
      const response = await axios.put(`/admin/users/${userid}/edit`, user);
      if (response.data.success) {
        appDispatch({ type: "loadingSpinning" });
        console.log("User updated successfully");
        navigate("/admin/users");
      }
    } catch (error) {
      appDispatch({ type: "loadingSpinning" });
      if (error.response.status === 403) {
        navigate("/");
      } else if (error.response.status === 404) {
        navigate("/notfound");
      }
      console.log("Error updating user:", error);
    }
  };
  const handleCheckboxChange = (e) => {
    dispatch({ type: "userisActive", value: e.target.checked });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const requests = [
          axios.get(`/admin/user/${userid}`),
          axios.get(`/admin/groups`),
        ];
        const [response1, response2] = await axios.all(requests);

        if (response1.data.data) {
          dispatch({ type: "fetchUserData", data: response1.data.data[0] });
        }
        if (response2.data.data) {
          dispatch({ type: "fetchUserGroupData", data: response2.data.data });
        }
      } catch (error) {
        console.error("Error fetching users:", error.response);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <Header />
      {appState.isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <h2>
            <i className="fa-solid fa-angles-left fa-2xl"></i> You are amending
            user:
            {userh1} details.
          </h2>
          <div className="container mt-4 p-3 border rounded border-secondary w-75">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  onBlur={(e) => {
                    dispatch({
                      type: "userpasswordRules",
                      value: e.target.value,
                    });
                  }}
                  onChange={(e) => {
                    dispatch({
                      type: "userpasswordChange",
                      value: e.target.value,
                    });
                  }}
                  placeholder="*********"
                />
                {state.userpassword.hasErrors && (
                  <div className="alert alert-danger small liveValidateMessage">
                    {state.userpassword.message}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  // value={user.email}
                  onChange={(e) =>
                    dispatch({ type: "useremailChange", value: e.target.value })
                  }
                />
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={Boolean(state.userisActive.value)}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="isActive">
                  Active
                </label>
              </div>
              <div className="mb-3">
                <label className="form-label">Usergroup Roles</label>
                <div className="dual-listbox d-flex justify-content-space-between">
                  <select
                    className="form-select"
                    multiple
                    value={
                      state.selectedUsergroups.value &&
                      state.selectedUsergroups.value.includes(",")
                        ? state.selectedUsergroups.value.split(",")
                        : state.selectedUsergroups.value
                        ? [state.selectedUsergroups.value]
                        : []
                    }
                    onChange={handleCurrentRoleChange}
                  >
                    {state.usergroups.data.map((group) => (
                      <option key={group.groupid} value={group.groupname}>
                        {group.groupname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
