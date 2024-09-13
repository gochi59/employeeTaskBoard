import { useState, useEffect } from "react";
import axios from "axios";
import { Employee, TemporaryEmployee } from "../models/AllModels";

const AdminApprovalDashboard = () => {
  const [users, setUsers] = useState<TemporaryEmployee[]>([]);
  const [headerConfig, setHeaderConfig] = useState({});
  const [errorPresent, setErrorPresent] = useState("");

  useEffect(() => {
    const jwt = localStorage.getItem("userToken") || "";
    const config = {
      headers: { Authorization: "Bearer " + jwt },
    };

    setHeaderConfig(config);
    async function fetchUsers() {
      try {
        const response = await axios.get(
          "http://localhost:8080/tempusers",
          config
        );
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUsers();
  }, []);
  console.log(users);
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

  const handleReject = async (empId: number) => {
    try {
      await axios.delete(
        `http://localhost:8080/admin/employee/reject/${empId}`,
        headerConfig
      );
      setUsers(users.filter((user) => user.tempId !== empId));
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
    <div className="container mt-4">
      <h2>Pending User Approvals</h2>
      <div className="row">
        {users.map((user: TemporaryEmployee) => (
          <div className="col-md-4" key={user.tempId}>
            <div className="card mb-4 shadow-sm">
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
                  <strong>Role:</strong>{" "}
                  {user.role === "empl" ? "Employee" : user.role}
                </p>
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
        ))}
      </div>
      {errorPresent && (
        <div
          className="toast show position-fixed bottom-0 end-0 m-3"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">Message</strong>
            <button
              type="button"
              className="btn-close"
              onClick={closeMessage}
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">{errorPresent}</div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovalDashboard;
