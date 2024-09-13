import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Employee } from '../models/AllModels';

const AdminDashboard = () => {
  const [empList, setEmpList] = useState<Employee[]>();
  const [headerConfig, setHeaderConfig] = useState({});
  const [loginId, setLoginId] = useState<String|undefined>("");

  useEffect(() => {
    const jwt = localStorage.getItem("userToken")||"";
    const { sub } = jwtDecode<JwtPayload>(jwt);
    setLoginId(sub);
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };
    setHeaderConfig(config);

    async function getAllEmp() {
      try {
        const res = await axios.get("http://localhost:8080/admin/employees", config);
        setEmpList(res.data);
      } catch (error) {
        console.log(error);
      }
    }

    getAllEmp();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container-fluid bg-light p-4">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {empList && empList.map((emp:Employee) => (
            <div className="col" key={emp.empId}>
              <div className="card h-100 shadow-sm border-0 rounded-4">
                <div className="card-body">
                  <h5 className="card-title mb-3 text-primary">
                    {emp.firstName} {emp.lastName}
                  </h5>
                  <p className="card-text">
                    <strong>Designation:</strong> {emp.designationTitle}
                  </p>
                  <p className="card-text">
                    <strong>Date of Joining:</strong> {emp.doj}
                  </p>
                  <p className="card-text">
                    <strong>Projects:</strong>
                  </p>
                  <ul className="list-unstyled">
                    {emp.projectTitles.map((project) => (
                      <li key={project} className="badge bg-secondary me-2">{project}</li>
                    ))}
                  </ul>
                </div>
                <div className="card-footer bg-transparent border-0 text-end">
                  <small className="text-muted">Employee ID: {emp.empId}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
