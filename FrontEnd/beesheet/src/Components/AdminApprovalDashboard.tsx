import { useState, useEffect } from "react";
import axios from "axios";
import { TemporaryEmployee, ReduxState } from "../models/AllModels";
import { useSelector } from "react-redux";
import ToastComponent from "./ToastComponent";
import Navbar from "./NavbarComponent";

const AdminApprovalDashboard = () => {
  const [users, setUsers] = useState<TemporaryEmployee[]>([]);
  const headerConfig = useSelector((state: ReduxState) => state.header);
  const [errorPresent, setErrorPresent] = useState("");
  const empId = useSelector((state: ReduxState) => state.ID);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(
          "http://localhost:8080/tempusers",
          headerConfig
        );
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUsers();
  }, [headerConfig]);

  const handleApprove = async (tempId: number) => {
    try {
      await axios.get(
        `http://localhost:8080/admin/employee/approve/${tempId}`,
        headerConfig
      );
      setUsers(users.filter((user) => user.tempId !== tempId));
      setErrorPresent(`User Approved`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (tempId: number) => {
    try {
      await axios.delete(
        `http://localhost:8080/admin/employee/reject/${tempId}`,
        headerConfig
      );
      setUsers(users.filter((user) => user.tempId !== tempId));
      setErrorPresent(`User Rejected`);
    } catch (error) {
      console.error(error);
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

  return (
    <>
      <Navbar empId={empId} config={headerConfig} />
      <div className="container-fluid vh-100 bg-dark-subtle mt-4">
        <div className="row mt-4 pt-5">
          {users &&
            users.slice().reverse().map((user: TemporaryEmployee) => (
              <div className="col-md-4" key={user.tempId}>
                <div className="card mb-4 shadow-sm border-0 rounded-4">
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
                      <strong>Date of Join:</strong> {user.dateOfJoin}
                    </p>
                    <p className="card-text">
                      <strong>Contact Number:</strong> {user.contactNumber}
                    </p>
                    <p className="card-text">
                      <strong>Role:</strong> {user.role === "empl" ? "Employee" : user.role}
                    </p>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-success me-2"
                        onClick={() => handleApprove(user.tempId)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleReject(user.tempId)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {errorPresent && (
          <ToastComponent closeMessage={closeMessage} errorPresent={errorPresent} />
        )}
      </div>
    </>
  );
};

export default AdminApprovalDashboard;
