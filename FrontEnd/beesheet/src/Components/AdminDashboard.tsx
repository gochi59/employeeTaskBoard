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
  console.log(empList);
  return (
    <div>
      <Navbar />
      <div className="container-fluid bg-dark-subtle overflow-y-auto p-4 vh-100">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {empList && empList.filter((emp:Employee)=>{
            const empDate=new Date(emp.doj).getFullYear();
            const currDate=new Date().getFullYear();
            // console.log(empDate,currDate);
            return empDate<=currDate-1;
            // return emp;
          }).map((emp:Employee) => (
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
                <div className="card-footer d-flex bg-transparent justify-content-between">
                  <button className="btn btn-primary">Tasks</button>
                  <p className="text-muted h5">Employee ID: {emp.empId}</p>
      
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
