import { useEffect, useState } from "react";
import Navbar from "./NavbarComponent";
import axios from "axios";
import {
  AttributeRating,
  Employee,
  ReduxState,
  Task,
} from "../models/AllModels";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { changeToken } from "../redux/HeaderSlice";
import TaskAttributeRating from "./TaskAttributeRating";
import EmployeeCard from "./EmployeeCard";

const AdminDashboard = () => {
  
  const [empList, setEmpList] = useState<Employee[]>();
  const [currEmpTaskList, setCurrEmpTaskList] = useState<Task[]>([]);
  const [taskTableToggle, setTaskTableToggle] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<string[]>([]);
  const [currEmpId, setCurrEmpId] = useState<number | undefined>();
  const [empAttributeRating, setEmpAttributeRating] = useState<AttributeRating[]>([]);

  const headerConfig = useSelector((state: ReduxState) => state.header);
  const loginId = useSelector((state: ReduxState) => state.ID);
  
  const { reset } = useForm();
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeToken());
  }, [dispatch]);

  useEffect(() => {
    async function getAllEmp() {
      try {
        const res = await axios.get("http://localhost:8080/admin/employees", headerConfig);
        const res2 = await axios.get("http://localhost:8080/notification/" + loginId, headerConfig);
        setNotification(res2.data);
        setEmpList(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllEmp();
  }, []);

  const openEmpTasks = (empId: number) => {
    setCurrEmpId(empId);
    async function getTaskList() {
      try {
        const res = await axios.get(`http://localhost:8080/tasks/${empId}`, headerConfig);
        const res2 = await axios.get("http://localhost:8080/admin/employee/attribute/" + empId, headerConfig);
        setEmpAttributeRating(res2.data);
        setCurrEmpTaskList(res.data);
        setTaskTableToggle(true);
        setShowModal(true);
      } catch (error) {
        console.log(error);
      }
    }
    getTaskList();
  };

  const closeModal = () => {
    setShowModal(false);
    setTaskTableToggle(false);
    reset();
  };

  const ratingSubmit = async (data: FieldValues) => {
    const taskPromises = currEmpTaskList.map((task) => {
      const str = task.taskId;
      const updatedTask = { ...task, taskRating: data[str] };
      return axios.put(`http://localhost:8080/admin/task/${str}`, updatedTask, headerConfig);
    });

    const attributePromises = empAttributeRating.map((attribute) => {
      const attributeTitle = attribute.attribute;
      const updatedAttribute = { ...attribute, rating: data[attributeTitle] };
      return axios.put(`http://localhost:8080/admin/employee/attribute/${currEmpId}`, updatedAttribute, headerConfig);
    });

    try {
      await Promise.all([...taskPromises, ...attributePromises]);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar empId={loginId} config={headerConfig} />
      <div>
        <div className="container-fluid bg-dark-subtle p-2 pb-3 rounded-1">
          <form className="d-flex justify-content-end">
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Search Name"
              className="p-1 rounded-3 border-0 m-2"
            />
            <button
              type="submit"
              className="btn btn-dark p-1 m-2"
              style={{ height: "2rem", width: "4.3rem" }}
            >
              Search
            </button>
          </form>

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
            {empList &&
              empList.filter((emp: Employee) => {
                const empDate = new Date(emp.doj).getFullYear();
                const currDate = new Date().getFullYear();
                return (
                  empDate <= currDate - 1 &&
                  emp.role !== "ADMIN" &&
                  emp.empTask.some((task: Task) => task.markedForAppraisal) &&
                  !emp.apprasailDone
                );
              }).map((emp: Employee) => (
                <EmployeeCard
                  key={emp.empId}
                  emp={emp}
                  openEmpTasks={() => openEmpTasks(emp.empId)}
                  buttonText={"Tasks"}
                  allProjects={emp.projectTitles}
                />
              ))}
            {empList &&
              empList.filter((emp: Employee) => {
                const empDate = new Date(emp.doj).getFullYear();
                const currDate = new Date().getFullYear();
                return (
                  empDate <= currDate - 1 &&
                  emp.role !== "ADMIN" &&
                  emp.empTask.some((task: Task) => task.markedForAppraisal) &&
                  emp.apprasailDone
                );
              }).map((emp: Employee) => (
                <EmployeeCard
                  key={emp.empId}
                  emp={emp}
                  openEmpTasks={() => openEmpTasks(emp.empId)}
                  buttonText={"Tasks"}
                  allProjects={emp.projectTitles}
                />
              ))}
          </div>
        </div>

        {showModal && (
          <TaskAttributeRating
            closeModal={closeModal}
            ratingSubmit={ratingSubmit}
            currEmpTaskList={currEmpTaskList}
            empAttributeRating={empAttributeRating}
          />
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
