import React from 'react'
import { Employee } from '../models/AllModels'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
interface props{
    emp:Employee;
    openEmpTasks:()=>void;
    buttonText:string;
    allProjects:string[];
}
const EmployeeCard = ({emp,openEmpTasks,buttonText,allProjects}:props) => {
  return (
    <div>
      <div className="col h-100 mt-2 p-2" key={emp.empId}>
                  <div className="card h-100 shadow-sm border-0 rounded-4 ">
                    <div className="card-body">
                      <h5 className="card-title mb-3 text-primary">
                        {emp.firstName} {emp.lastName}
                        {emp.apprasailDone&&<OverlayTrigger
                          delay={{ hide: 450, show: 200 }}
                          overlay={(props) => (
                            <Tooltip {...props}>
                              Employee Rated
                            </Tooltip>
                          )}
                        >
                          <i
                            className="fa fa-solid fa-check"
                            style={{ color: "green" }}
                          ></i>
                        </OverlayTrigger>}
                      </h5>
                      <p className="card-text">
                        <strong>Designation:</strong> {emp.designationTitle}
                      </p>
                      <p className="card-text">
                        <strong>Email:</strong> {emp.email}
                      </p>
                      <p className="card-text">
                        <strong>Date of Joining:</strong> {emp.doj}
                      </p>
                      <p className="card-text">
                        <strong>Projects:</strong>
                      </p>
                      <ul className="list-unstyled">
                        {allProjects.map((project) => (
                          <li className="badge bg-secondary me-2">{project}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="card-footer d-flex bg-transparent justify-content-between">
                      <button
                        className="btn btn-primary"
                        onClick={openEmpTasks}
                      >
                        {buttonText}
                      </button>
                      <p className="text-muted h5">Employee ID: {emp.empId}</p>
                    </div>
                  </div>
                </div>
              
    </div>
  )
}

export default EmployeeCard
