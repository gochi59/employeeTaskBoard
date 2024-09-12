import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';

const AdminApprovalDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch pending users
    const jwt = localStorage.getItem("userToken");
    const { sub } = jwtDecode<JwtPayload>(jwt);
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };
    async function fetchUsers() {
      try {
        const response = await axios.get('http://localhost:8080/tempusers',config);
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUsers();
  }, []);

  const handleApprove = async (tempId) => {
    // Handle approval
    try {
      await axios.post(`http://localhost:8080/admin/approve/${tempId}`);
      setUsers(users.filter(user => user.tempId !== tempId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (tempId) => {
    // Handle rejection
    try {
      await axios.post(`http://localhost:8080/admin/reject/${tempId}`);
      setUsers(users.filter(user => user.tempId !== tempId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Pending User Approvals</h2>
      <div className="row">
        {users.map(user => (
          <div className="col-md-4" key={user.tempId}>
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{user.firstName} {user.lastName}</h5>
                <p className="card-text"><strong>Email:</strong> {user.email}</p>
                <p className="card-text"><strong>Designation:</strong> {user.designation}</p>
                <p className="card-text"><strong>Date of Join:</strong> {user.dateOfJoin}</p>
                <p className="card-text"><strong>Contact Number:</strong> {user.contactNumber}</p>
                <button className="btn btn-success me-2" onClick={() => handleApprove(user.tempId)}>Approve</button>
                <button className="btn btn-danger" onClick={() => handleReject(user.tempId)}>Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminApprovalDashboard;
