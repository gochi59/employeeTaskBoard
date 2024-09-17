import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
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

const AdminDashboard = () => {
  const [empList, setEmpList] = useState<Employee[]>();
  // const [headerConfig, setHeaderConfig] = useState(use);
  const headerConfig = useSelector((state: ReduxState) => state.header);
  // const [loginId, setLoginId] = useState<string>("");
  const loginId = useSelector((state: ReduxState) => state.ID);
  const [currEmpTaskList, setCurrEmpTaskList] = useState<Task[]>([]);
  const [taskTableToggle, setTaskTableToggle] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<String[]>([]);
  const [empAttributeRating, setEmpAttributeRating] = useState<
    AttributeRating[]
  >([]);
  const { register, handleSubmit, reset } = useForm();
  const [currEmpId, setCurrEmpId] = useState();
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
          attribute.rating = data[attributeTitle];
          const res = await axios.put(
            "http://localhost:8080/admin/employee/attribute/" + currEmpId,
            attribute,
            headerConfig
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

  return (
    <div>
      <Navbar empId={loginId} config={headerConfig} />
      <div className="container-fluid bg-dark-subtle mt-4 p-4 vh-100">
        <form className="d-flex ">
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
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {empList &&
            empList
              .filter((emp: Employee) => {
                const empDate = new Date(emp.doj).getFullYear();
                const currDate = new Date().getFullYear();
                return empDate <= currDate - 1 && emp.role != "ADMIN";
              })
              .map((emp: Employee) => (
                <div className="col" key={emp.empId}>
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
                        onClick={() => openEmpTasks(emp.empId)}
                      >
                        Tasks
                      </button>
                      <p className="text-muted h5">Employee ID: {emp.empId}</p>
                    </div>
                  </div>
                </div>
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
