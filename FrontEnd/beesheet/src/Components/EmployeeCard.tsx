import React, { useEffect, useState } from "react";
import {
  AttributeRating,
  Employee,
  Project,
  ReduxState,
  Task,
} from "../models/AllModels";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import TaskAttributeRating from "./TaskAttributeRating";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import TaskAttributeRatingSkeleton from "./Skeletons/TaskAttributeRatingSkeleton";
import ProjectModal from "./ProjectModal";
import { clearToken } from "../redux/HeaderSlice";
import { Navigate } from "react-router-dom";

interface props {
  emp: Employee;
  buttonText: string;
  allProjects: string[];
  loading: boolean;
  updateEmployeeProjects: (emp: number, projects: string[]) => void;
}

const EmployeeCard = ({
  emp,
  buttonText,
  allProjects,
  loading,
  updateEmployeeProjects,
}: props) => {
  const [loader, setLoader] = useState<boolean>(false);
  const headerConfig = useSelector((state: ReduxState) => state.header);
  const [empAttributeRating, setEmpAttributeRating] = useState<
    AttributeRating[]
  >([]);
  const [currEmpTaskList, setCurrEmpTaskList] = useState<Task[]>([]);
  const [currEmp, setCurrEmp] = useState<Employee>();
  const [showModal, setShowModal] = useState(false);
  const { reset } = useForm();
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [projectModalToggle, setProjectModalToggle] = useState(false);
  const [currAttributeList,setCurrAttributeList]=useState<AttributeRating[]>([]);
  const dispatch = useDispatch();

  const decideEmpOrProj = (emp: Employee) => {
    if (loading) {
      openEmpTasks(emp.empId);
    } else {
      openProjects(emp);
    }
  };


  async function getTaskList(empId:number) {
    try {
      const res = await axios.get(
        `http://localhost:8080/tasks/${empId}`,
        {
          ...headerConfig,
          params:{
            pageNumber:0,
            pageSize:100000
          }
        }
      );
      const res2 = await axios.get(
        `http://localhost:8080/admin/employee/attribute/${empId}`,
        headerConfig
      );
      setEmpAttributeRating(res2.data);
      setCurrEmpTaskList(res.data);
    } catch (error: any) {
      console.log(error);
      if (
        error.response.data === "JWT token is expired." ||
        error.response.data === "Invalid JWT token."
      ) {
        dispatch(clearToken());
        localStorage.removeItem("userToken");
      }
    } finally {
      setLoader(false);
    }
  }

  async function getAttributeRating(empId:number)
  {
    try {
      const res=await axios.get(`http://localhost:8080/admin/employee/attribute/${empId}`,headerConfig);
      setCurrAttributeList(res.data);
    } catch (error:any) {
      console.log(error);
      if (
        error.response.data === "JWT token is expired." ||
        error.response.data === "Invalid JWT token."
      ) {
        dispatch(clearToken());
        localStorage.removeItem("userToken");
      }
    }
    finally {
      setLoader(false);
    }
  }


  useEffect(()=>{
    getTaskList(emp.empId);
    getAttributeRating(emp.empId);

  },[])
  const openEmpTasks = (empId: number) => {
    setLoader(true);
    
    getTaskList(empId);
    setShowModal(true);

  };

  const openProjects = (empId: Employee) => {
    setCurrEmp(empId);
    async function getAllProjects() {
      try {
        const res = await axios.get(
          `http://localhost:8080/project`,
          headerConfig
        );
        setProjectList(res.data);
        setProjectModalToggle(true);
        // setCurrEmp(empId);
      } catch (error: any) {
        console.error("Error fetching projects:", error);
        if (
          error.response.data === "JWT token is expired." ||
          error.response.data === "Invalid JWT token."
        ) {
          dispatch(clearToken());
          localStorage.removeItem("userToken");
        }
      }
    }
    getAllProjects();
    // console.log(empList);
    // console.log(projectList,currEmp)
  };

  const closeModal = () => {
    setShowModal(false);
    setProjectModalToggle(false);
    reset();
  };

  // console.log(emp);
  if (!localStorage.getItem("userToken")) {
    return <Navigate to="/"></Navigate>;
  }
  return (
    <div>
      <div className="col h-100 mt-2 p-2" key={emp.empId}>
        <div className="card h-100 shadow-sm border-0 rounded-4">
          <div className="card-body">
            <h5 className="card-title mb-3 text-primary d-flex justify-content-between">
              {emp.firstName} {emp.lastName}
              {emp.apprasailDone && (
                <>
                  <OverlayTrigger
                    delay={{ hide: 450, show: 200 }}
                    overlay={(props) => (
                      <Tooltip {...props}>Employee Rated</Tooltip>
                    )}
                  >
                    <i
                      className="fa fa-solid fa-check"
                      style={{ color: "green" }}
                    ></i>
                  </OverlayTrigger>
                  <OverlayTrigger
                    delay={{ hide: 450, show: 200 }}
                    overlay={(props) => (
                      <Tooltip {...props}>Average Employee Task Rating</Tooltip>
                    )}
                  >
                    <span className="px-2">
                      {(
                        currEmpTaskList
                          .filter(
                            (task: Task) =>
                              task.taskRating !== "0" && task.markedForAppraisal
                          )
                          .reduce(
                            (acc, task) => acc + parseInt(task.taskRating),
                            0
                          ) /
                        currEmpTaskList.filter(
                          (task: Task) =>
                            task.taskRating !== "0" && task.markedForAppraisal
                        ).length
                      ).toFixed(2)}
                    </span>
                  </OverlayTrigger>
                  <OverlayTrigger
                    delay={{ hide: 450, show: 200 }}
                    overlay={(props) => (
                      <Tooltip {...props}>Average Employee Attribute Rating</Tooltip>
                    )}
                  >
                    <span className="px-2">
                      {(
                        currAttributeList
                          .filter(
                            (attribute: AttributeRating) =>
                              attribute.rating !== "0" 
                          )
                          .reduce(
                            (acc, attribute) => acc + parseInt(attribute.rating),
                            0
                          ) /
                        currAttributeList.filter(
                          (attribute: AttributeRating) =>
                            attribute.rating !== "0" 
                            
                        ).length
                      ).toFixed(2)}
                    </span>
                  </OverlayTrigger>
                </>
              )}
            </h5>
            <p className="card-text">
              <strong>Designation:</strong> {emp.designationTitle}
            </p>
            <p className="card-text">
              <strong>Email:</strong> {emp.email}
            </p>
            <p className="card-text">
              <strong>Date of Joining:</strong> {emp.doj.slice(0, 10)}
            </p>
            <p className="card-text">
              <strong>Projects:</strong>
            </p>
            <ul className="list-unstyled">
              {allProjects.map((project) => (
                <li className="badge bg-secondary me-2" key={project}>
                  {project}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-footer d-flex bg-transparent justify-content-between">
            <button
              className="btn btn-primary"
              onClick={() => decideEmpOrProj(emp)}
            >
              {buttonText}
            </button>
            <p className="text-muted h5">Employee ID: {emp.empId}</p>
          </div>
        </div>
      </div>
      {(showModal && loader) && loading && <TaskAttributeRatingSkeleton />}
      {showModal && !loader && loading && (
        <TaskAttributeRating
          closeModal={closeModal}
          currEmpTaskList={currEmpTaskList}
          empAttributeRating={empAttributeRating}
          currEmpId={emp}
          setCurrEmpTaskList={setCurrEmpTaskList}
          currAttributeList={currAttributeList}
          setCurrAttributeList={setCurrAttributeList}
        />
      )}
      {projectModalToggle && (
        <ProjectModal
          closeModal={closeModal}
          projectList={projectList}
          updateEmpProjects={updateEmployeeProjects}
          currEmp={currEmp}
        />
      )}
    </div>
  );
};

export default EmployeeCard;
