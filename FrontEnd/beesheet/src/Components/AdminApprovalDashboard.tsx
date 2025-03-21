import { useState, useEffect } from "react";
import { TemporaryEmployee, ReduxState } from "../models/AllModels";
import { useDispatch, useSelector } from "react-redux";
import ToastComponent from "./ToastComponent";
import Navbar from "./NavbarComponent";
import EmployeeCardSkeleton from "./Skeletons/EmployeeCardSkeleton";
import { Navigate } from "react-router-dom";
import { clearToken } from "../redux/HeaderSlice";
import axiosInstance from "../axios/axiosInstance";


// The page where admin approves which user to approve from signup and which to reject
const AdminApprovalDashboard = () => {
  const [users, setUsers] = useState<TemporaryEmployee[]>();
  const headerConfig = useSelector((state: ReduxState) => state.header);
  const [errorPresent, setErrorPresent] = useState("");
  const [loader, setLoader] = useState(false);
  const [navigateToError, setNavigateToError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axiosInstance.get(
          "/tempusers"
        );
        setUsers(response.data);
      } catch (error: any) {
        console.error(error);
        if ((error.message as string).includes("Invalid token specified:")) {
          setNavigateToError(true);
        }
        if (error.message === "Network Error") {
          setErrorPresent("Internal Server Error");
        }
        if (error.response.status === 401||error.response.status===403) {
          setNavigateToError(true);
        } else if (
          error.response.data === "JWT token is expired." ||
          error.response.data === "Invalid JWT token."
        ) {
          dispatch(clearToken());
          localStorage.removeItem("userToken");
        }
      }
    }
    fetchUsers();
  }, []);

  const handleApprove = async (tempId: number) => {
    setLoader(true);
    try {
      await axiosInstance.get(
        `/admin/employee/approve/${tempId}`
      );
      setUsers(users.filter((user) => user.tempId !== tempId));
      setErrorPresent(`User Approved`);
    } catch (error: any) {
      console.error(error);
      if ((error.message as string).includes("Invalid token specified:")) {
        setNavigateToError(true);
      }
      if (
        error.response.data === "JWT token is expired." ||
        error.response.data === "Invalid JWT token."
      ) {
        // dispatch(clearToken());
        localStorage.removeItem("userToken");
      }
    } finally {
      setLoader(false);
    }
  };

  const handleReject = async (tempId: number) => {
    setLoader(true);
    try {
      await axiosInstance.delete(
        `/admin/employee/reject/${tempId}`,
        headerConfig
      );
      setUsers(users.filter((user) => user.tempId !== tempId));
      setErrorPresent(`User Rejected`);
    } catch (error: any) {
      console.error(error);
      if ((error.message as string).includes("Invalid token specified:")) {
        setNavigateToError(true);
      }
      if (
        error.response.data === "JWT token is expired." ||
        error.response.data === "Invalid JWT token."
      ) {
        dispatch(clearToken());
        localStorage.removeItem("userToken");
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (errorPresent) {
      const timer = setTimeout(() => {
        setErrorPresent("");
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [errorPresent]);

  const closeMessage = () => {
    setErrorPresent("");
  };

  if (!localStorage.getItem("userToken")) {
    return <Navigate to="/"></Navigate>;
  }
  if (navigateToError) {
    return <Navigate to="*" replace={false} />;
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid min-vh-100 bg-dark-subtle pt-md-0 pt-5">
        <div className="row pt-5 mt-4">
          {!users && <EmployeeCardSkeleton />}
          {users?.length===0&&<h2 className="text-center">No new sign up</h2>}
          {users &&
            users
              .slice()
              .reverse()
              .map((user: TemporaryEmployee) => (
                <div className="col-md-4 pb-3" key={user.tempId}>
                  <div className="card mb-4 shadow-sm border-0 rounded-4 h-100 p-2">
                    <div className="card-body">
                      <h5 className="card-title">
                        {user.firstName} {user.lastName}
                      </h5>
                      <p className="card-text">
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p className="card-text">
                        <strong>Designation:</strong> {user.designation}
                      </p>
                      <p className="card-text">
                        <strong>Date of Join:</strong> {user.dateOfJoin.slice(0,10)}
                      </p>
                      <p className="card-text">
                        <strong>Contact Number:</strong> {user.contactNumber}
                      </p>
                      <p className="card-text">
                        <strong>Role:</strong>{" "}
                        {user.role === "empl" ? "Employee" : user.role}
                      </p>
                    </div>
                    <div className="card-footer d-flex justify-content-between">
                      <button
                        className="btn btn-success me-2"
                        onClick={() => handleApprove(user.tempId)}
                        disabled={loader}
                      >
                        {loader && (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        )}
                        Approve
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleReject(user.tempId)}
                        disabled={loader}
                      >
                        {loader && (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        )}
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
        {errorPresent && (
          <ToastComponent
            closeMessage={closeMessage}
            errorPresent={errorPresent}
          />
        )}
      </div>
    </>
  );
};

export default AdminApprovalDashboard;
