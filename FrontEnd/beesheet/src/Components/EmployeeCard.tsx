import React from 'react'
import { Employee } from '../models/AllModels'
interface props{
    emp:Employee;
    openEmpTasks:()=>void;
    buttonText:string;
}
const EmployeeCard = ({emp,openEmpTasks,buttonText}:props) => {
  return (
    <div>
      <div className="col h-100 mt-2 p-1" key={emp.empId}>
                  <div className="card h-100 shadow-sm border-0 rounded-4">
                    <div className="card-body">
                      <h5 className="card-title mb-3 text-primary">
                        {emp.firstName} {emp.lastName}
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
                        {emp.projectTitles.map((project) => (
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
