import React, { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { Employee, Project, ReduxState } from "../models/AllModels";
import axios from "axios";
import { useSelector } from "react-redux";

interface Props {
  closeModal: () => void;
  projectList: Project[];
  currEmp: Employee;
}

const ProjectModal = ({ closeModal, projectList, currEmp }: Props) => {
  const { register, reset, handleSubmit } = useForm();
  const headerConfig = useSelector((state: ReduxState) => state.header);
    const [loader,setLoader]=useState(false);

  const assignProjects = async (data: FieldValues) => {
    setLoader(true);
    const responseBody = {
      projects: data.project.map((str: string) => parseInt(str)),
    };

    if (currEmp) {
      try {
        await axios.post(
          `http://localhost:8080/admin/project/${currEmp.empId}`,
          responseBody,
          headerConfig
        );
        closeModal();
        reset();
      } catch (error) {
        console.error("Error assigning project:", error);
      }
      finally{
        setLoader(false);
      }
    }
  };

  return (
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
          <form onSubmit={handleSubmit(assignProjects)}>
            <div className="modal-body">
              <label htmlFor="project">Select a project:</label>
              <select
                id="project"
                required
                {...register("project")}
                className="form-select"
                multiple
              >
                {projectList
                  .filter(
                    (project) =>
                      !project.emp.some((emp) => emp.empId === currEmp.empId)
                  )
                  .map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <button type="submit" className="btn btn-success m-1" disabled={loader}>
              {loader&&<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                Assign Project
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
                disabled={loader}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
