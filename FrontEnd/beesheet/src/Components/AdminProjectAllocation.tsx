import React, { useEffect, useState } from "react";
import { Employee, Project, ReduxState } from "../models/AllModels";
import { useSelector } from "react-redux";
import axios from "axios";
import EmployeeCard from "./EmployeeCard";
import { FieldValues, useForm } from "react-hook-form";

const AdminProjectAllocation = () => {
  const config = useSelector((state: ReduxState) => state.header);
  const [empList, setEmpList] = useState<Employee[]>([]);
  const [currEmpId, setCurrEmpId] = useState<number | null>(null); 
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [projectModalToggle, setProjectModalToggle] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  
  useEffect(() => {
    async function getAllEmp() {
      try {
        const res = await axios.get("http://localhost:8080/admin/employees", config);
        setEmpList(res.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }
    getAllEmp();
  }, [config]);

  
  const openProjects = (empId: number) => {
    setCurrEmpId(empId); 
    async function getAllProjects() {
      try {
        const res = await axios.get(`http://localhost:8080/${empId}/project`, config);
        setProjectList(res.data);
        setProjectModalToggle(true); 
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }
    getAllProjects();
  };


  const closeModal = () => {
    setProjectModalToggle(false);
    reset(); 
  };

  const assignProjects = async (data: FieldValues) => {
    if (currEmpId) {
      try {
        console.log(`Assigning project ${data.project} to employee ${currEmpId}`);

       
        setProjectModalToggle(false);
        reset();
      } catch (error) {
        console.error("Error assigning project:", error);
      }
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-dark-subtle">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
        {empList
          .filter((emp: Employee) => emp.role === "empl")
          .map((emp: Employee) => (
            <EmployeeCard
              key={emp.empId}
              emp={emp}
              openEmpTasks={() => openProjects(emp.empId)} 
              buttonText="Projects" 
            />
          ))}
      </div>

      {projectModalToggle && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign Project to Employee</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <form className="" onSubmit={handleSubmit(assignProjects)}>
                <div className="modal-body">
                  <label htmlFor="project">Select a project:</label>
                  <select id="project" required {...register("project")} className="form-select">
                    <option value="">--Select Project--</option>
                    {projectList &&
                      projectList.map((project: Project) => (
                        <option key={project.id} value={project.name}>
                          {project.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="modal-footer d-flex justify-content-between">
                  <button type="submit" className="btn btn-success m-1">
                    Assign Project
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectAllocation;
