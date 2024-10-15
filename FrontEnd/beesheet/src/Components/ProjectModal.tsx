import React, { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { Employee, Project, ReduxState } from "../models/AllModels";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "../redux/HeaderSlice";
import { Navigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";

interface Props {
  closeModal: () => void;
  projectList: Project[];
  currEmp: Employee;
  updateEmpProjects: (emp: number, projects: string[]) => void;
}

//Project Modal used for assigning multiple projects to the employee selected using the employee card project button
//Only shows list of projects not already assigned to the employee

const ProjectModal = ({
  closeModal,
  projectList,
  currEmp,
  updateEmpProjects,
}: Props) => {
  const { register, reset, handleSubmit } = useForm();
  const [loader, setLoader] = useState(false);
  const assignProjects = async (data: FieldValues) => {
    setLoader(true);
    const responseBody = {
      projects: data.project.map((str: string) => parseInt(str)),
    };

    if (currEmp) {
      try {
        await axiosInstance.post(
          `/admin/project/${currEmp.empId}`,
          responseBody
        );
        const newProjectsToBeAdded = projectList.filter((project: Project) =>
          data.project.includes(String(project.id))
        );
        updateEmpProjects(currEmp.empId, [
          ...currEmp.projectTitles,
          ...newProjectsToBeAdded.map((project: Project) => project.name),
        ]);
        closeModal();
        reset();
      } catch (error: any) {
        console.error("Error assigning project:", error);
        // if (
        //   error.response.data === "JWT token is expired." ||
        //   error.response.data === "Invalid JWT token."
        // ) {
        //   dispatch(clearToken());
        //   localStorage.removeItem("userToken");
        // }
      } finally {
        setLoader(false);
      }
    }
  };

  if (!localStorage.getItem("userToken")) {
    return <Navigate to="/"></Navigate>;
  }

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
              <label htmlFor="project">Select a project (Hold cntrl for multiple selections) :</label>
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
              <button
                type="submit"
                className="btn btn-success m-1"
                disabled={loader}
              >
                {loader && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
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
