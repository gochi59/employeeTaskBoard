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
  const [notification, setNotification] = useState<String[]>([]);
  const [currEmpId, setCurrEmpId] = useState();
  const [empAttributeRating, setEmpAttributeRating] = useState<
    AttributeRating[]
  >([]);

  const headerConfig = useSelector((state: ReduxState) => state.header);
  const loginId = useSelector((state: ReduxState) => state.ID);
  
  const { reset } = useForm();
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeToken());
  }, []);

  useEffect(() => {
    async function getAllEmp() {
      try {
        const res = await axios.get(
          "http://localhost:8080/admin/employees",
          headerConfig
        );
        const res2 = await axios.get(
          "http://localhost:8080/notification/" + loginId,
          headerConfig
        );
        setNotification(res2.data);
        setEmpList(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllEmp();
  }, []);
  // console.log(notification);

  const openEmpTasks = (empId: number) => {
    setCurrEmpId(empId);
    async function getTaskList() {
      try {
        const res = await axios.get(
          `http://localhost:8080/tasks/${empId}`,
          headerConfig
        );
        const res2 = await axios.get(
          "http://localhost:8080/admin/employee/attribute/" + empId,
          headerConfig
        );
        setEmpAttributeRating(res2.data);
        setCurrEmpTaskList(res.data);
        setTaskTableToggle(true);
        setShowModal(true);
        // console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getTaskList();
  };
  // console.log(empAttributeRating);
  const closeModal = () => {
    setShowModal(false);
    setTaskTableToggle(false);
    reset();
  };

  const ratingSubmit = (data: FieldValues) => {
    // console.log(data);
    currEmpTaskList.map((task) => {
      const str = task.taskId;
      async function changeRating() {
        try {
          task.taskRating = data[str];
          // console.log(task);
          const res = await axios.put(
            `http://localhost:8080/admin/task/${str}`,
            task,
            headerConfig
          );
          console.log(res);
        } catch (error) {
          console.log(error);
        }
      }
      changeRating();
      closeModal();
    });
    empAttributeRating.map((attribute: AttributeRating) => {
      const attributeTitle = attribute.attribute;
      async function changeAttributeRating() {
        try {
          const notification = {
            data: `Admin has rated your tasks marked for appraisal`,
          };
          attribute.rating = data[attributeTitle];
          const res = await axios.put(
            "http://localhost:8080/admin/employee/attribute/" + currEmpId,
            attribute,
            headerConfig
          );
          await axios.post(
            "http://localhost:8080/notification/" + currEmpId,
            notification
          );
          console.log(res);
        } catch (error) {
          console.log(error);
        }
      }
      changeAttributeRating();
      closeModal();
    });
  };

  console.log(empList);
  return (
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
            empList
              .filter((emp: Employee) => {
                const empDate = new Date(emp.doj).getFullYear();
                const currDate = new Date().getFullYear();
                return (
                  empDate <= currDate - 1 &&
                  emp.role != "ADMIN" &&
                  emp.empTask.some((task: Task) => task.markedForAppraisal) &&
                  !emp.apprasailDone
                );
              })
              .map((emp: Employee) => (
                <EmployeeCard
                  emp={emp}
                  openEmpTasks={() => openEmpTasks(emp.empId)}
                  buttonText={"Tasks"}
                  allProjects={emp.projectTitles}
                ></EmployeeCard>
              ))}
          {empList &&
            empList
              .filter((emp: Employee) => {
                const empDate = new Date(emp.doj).getFullYear();
                const currDate = new Date().getFullYear();
                return (
                  empDate <= currDate - 1 &&
                  emp.role != "ADMIN" &&
                  emp.empTask.some((task: Task) => task.markedForAppraisal) &&
                  emp.apprasailDone
                );
              })
              .map((emp: Employee) => (
                <EmployeeCard
                  emp={emp}
                  openEmpTasks={() => openEmpTasks(emp.empId)}
                  buttonText={"Tasks"}
                  allProjects={emp.projectTitles}
                ></EmployeeCard>
              ))}
        </div>
      </div>

      {showModal && (
        <TaskAttributeRating
          closeModal={closeModal}
          ratingSubmit={ratingSubmit}
          currEmpTaskList={currEmpTaskList}
          empAttributeRating={empAttributeRating}
        ></TaskAttributeRating>
      )}
    </div>
  );
};

export default AdminDashboard;
