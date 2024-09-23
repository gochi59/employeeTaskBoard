import React, { useState } from 'react';
import { AttributeRating, Employee, Project, ReduxState, Task } from '../models/AllModels';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from 'axios';
import TaskAttributeRating from './TaskAttributeRating';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import TaskAttributeRatingSkeleton from './Skeletons/TaskAttributeRatingSkeleton';
import ProjectModal from './ProjectModal';

interface props {
  emp: Employee;
  buttonText: string;
  allProjects: string[];
  loading: boolean;
}

const EmployeeCard = ({ emp, buttonText, allProjects, loading }: props) => {
  const [loader, setLoader] = useState<boolean>(false);
  const headerConfig = useSelector((state: ReduxState) => state.header);
  const [empAttributeRating, setEmpAttributeRating] = useState<AttributeRating[]>([]);
  const [currEmpTaskList, setCurrEmpTaskList] = useState<Task[]>([]);
  const [currEmp,setCurrEmp]=useState<Employee>();
  const [showModal, setShowModal] = useState(false);
  const { reset } = useForm();
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [projectModalToggle, setProjectModalToggle] = useState(false);

const decideEmpOrProj=(emp:Employee)=>{
    if(loading)
    {
        openEmpTasks(emp.empId);
    }
    else
    {
        openProjects(emp);   
    }
}

  const openEmpTasks = (empId: number) => {
    setLoader(true);
    async function getTaskList() {
      try {
        const res = await axios.get(`http://localhost:8080/tasks/${empId}`, headerConfig);
        const res2 = await axios.get(`http://localhost:8080/admin/employee/attribute/${empId}`, headerConfig);
        setEmpAttributeRating(res2.data);
        setCurrEmpTaskList(res.data);
        setShowModal(true);
      } catch (error) {
        console.log(error);
      } finally {
        setLoader(false);
      }
    }
    getTaskList();
  };

  const openProjects = (empId: Employee) => {
    setCurrEmp(empId);
    async function getAllProjects() {
      try {
        const res = await axios.get(`http://localhost:8080/project`, headerConfig);
        setProjectList(res.data);
        setProjectModalToggle(true);
        // setCurrEmp(empId);
      } catch (error) {
        console.error("Error fetching projects:", error);
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
  
console.log(emp);
  return (
    <div>
      <div className="col h-100 mt-2 p-2" key={emp.empId}>
        <div className="card h-100 shadow-sm border-0 rounded-4">
          <div className="card-body">
            <h5 className="card-title mb-3 text-primary">
              {emp.firstName} {emp.lastName} {emp.apprasailDone}
              {emp.apprasailDone && (
                <OverlayTrigger
                  delay={{ hide: 450, show: 200 }}
                  overlay={(props) => <Tooltip {...props}>Employee Rated</Tooltip>}
                >
                  <i className="fa fa-solid fa-check" style={{ color: "green" }}></i>
                </OverlayTrigger>
              )}
            </h5>
            <p className="card-text"><strong>Designation:</strong> {emp.designationTitle}</p>
            <p className="card-text"><strong>Email:</strong> {emp.email}</p>
            <p className="card-text"><strong>Date of Joining:</strong> {emp.doj}</p>
            <p className="card-text"><strong>Projects:</strong></p>
            <ul className="list-unstyled">
              {allProjects.map((project) => (
                <li className="badge bg-secondary me-2" key={project}>{project}</li>
              ))}
            </ul>
          </div>
          <div className="card-footer d-flex bg-transparent justify-content-between">
            <button className="btn btn-primary" onClick={() => decideEmpOrProj(emp)}>
              {buttonText}
            </button>
            <p className="text-muted h5">Employee ID: {emp.empId}</p>
          </div>
        </div>
      </div>
      {(showModal ||loader)&&loading&&(<TaskAttributeRatingSkeleton />)}
      {showModal &&!loader && loading&&(
        <TaskAttributeRating
          closeModal={closeModal}
          currEmpTaskList={currEmpTaskList}
          empAttributeRating={empAttributeRating}
          currEmpId={emp}
        />
      )}
      {projectModalToggle&&<ProjectModal closeModal={closeModal}  projectList={projectList} currEmp={currEmp}/>}
    </div>
  );
};

export default EmployeeCard;
