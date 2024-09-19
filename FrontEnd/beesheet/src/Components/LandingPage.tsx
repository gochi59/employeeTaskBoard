import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Employee, ReduxState } from "../models/AllModels";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Navbar from "./NavbarComponent";

const LandingPage = () => {
  const config = useSelector((state: ReduxState) => state.header);
  const empId = useSelector((state: ReduxState) => state.ID);
  const [currEmp, setCurrEmp] = useState<Employee>();
  const [navigateToEmp, setNavigateToEmp] = useState<boolean>(false);
  const [navigateToAdminProject,setNavigateToAdminProject]=useState<boolean>(false);
  const [navigateToAdminAppraisal,setNavigateToAdminAppraisal]=useState<boolean>(false);
  const [empApproval,setEmpApproval]=useState<boolean>(false);

  useEffect(() => {
    async function fetchEmployeeInfo() {
      try {
        const res = await axios.get(
          `http://localhost:8080/employee/${empId}`,
          config
        );
        setCurrEmp(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchEmployeeInfo();
  }, []);

  const handleNavigateEmployee = () => {
    setNavigateToEmp(true);
  };
  
  const handleProjectAllocation=()=>{
    setNavigateToAdminProject(true);
  };

  const handleEmpAppraisal=()=>{
    setNavigateToAdminAppraisal(true);
  }

  const handleApprove=()=>{
    setEmpApproval(true);
  }

  if (navigateToEmp) {
    return <Navigate to="/user" />;
  }

  if(navigateToAdminProject)
  {
    return <Navigate to="/admin/project"></Navigate>
  }

  if(navigateToAdminAppraisal)
  {
    return <Navigate to="/admin"></Navigate>
  }

  if(empApproval)
  {
    return <Navigate to="/admin/approval"></Navigate>
  }

  return (
    currEmp && (
        <>
        <Navbar empId={empId} config={config}/>
      <section className="container-fluid vh-100 bg-dark-subtle py-5 mt-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4 ">
              <div className="card text-center h-100">
                <div className="card-body">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                    alt="avatar"
                    className="rounded-circle img-fluid mb-3"
                    style={{ width: "150px" }}
                  />
                  <h5 className="card-title mb-2">
                    {currEmp.firstName} {currEmp.lastName}
                  </h5>
                  <p className="card-text text-muted mb-4">
                    {currEmp.role === "empl" ? "Employee" : "Admin"}
                  </p>
                  <p className="card-text mb-4">
                    EmpId: {currEmp.empId}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-8">
              <div className="card mb-4 h-100 shadow-sm border-light">
                <div className="card-body">
                  <h5 className="card-title mb-4">Details</h5>
                  <ul className="list-unstyled">
                    <li className="d-flex justify-content-between mb-3">
                      <strong className="text-muted">Full Name:</strong>
                      <span>
                        {currEmp.firstName} {currEmp.lastName}
                      </span>
                    </li>
                    <li className="d-flex justify-content-between mb-3">
                      <strong className="text-muted">Email:</strong>
                      <span>{currEmp.email}</span>
                    </li>
                    <li className="d-flex justify-content-between mb-3">
                      <strong className="text-muted">Phone:</strong>
                      <span>{currEmp.contactNumber}</span>
                    </li>
                    <li className="d-flex justify-content-between">
                      <button
                        className="btn btn-primary"
                        onClick={handleNavigateEmployee}
                        hidden={currEmp.role !== "empl"}
                      >
                        View Tasks
                      </button>
                      <button
                        className="btn  btn-primary"
                        onClick={handleProjectAllocation}
                        hidden={currEmp.role !== "ADMIN"}
                      >
                        Project Allocation
                      </button>
                      <button
                        className="btn  btn-primary"
                        onClick={handleEmpAppraisal}
                        hidden={currEmp.role !== "ADMIN"}
                      >
                        Appraisal
                      </button>
                      <button
                        className="btn  btn-primary"
                        onClick={handleApprove}
                        hidden={currEmp.role !== "ADMIN"}
                      >
                        Approval
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </>
    )
  );
};

export default LandingPage;
