import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AttributeRating, Employee, Task } from "../models/AllModels";
import { FieldValues, useForm } from "react-hook-form";

const AdminDashboard = () => {
  const [empList, setEmpList] = useState<Employee[]>();
  const [headerConfig, setHeaderConfig] = useState({});
  const [loginId, setLoginId] = useState<string>("");
  const [currEmpTaskList, setCurrEmpTaskList] = useState<Task[]>([]);
  const [taskTableToggle, setTaskTableToggle] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [notification,setNotification]=useState<String[]>([]);
  const [empAttributeRating, setEmpAttributeRating] = useState<
    AttributeRating[]
  >([]);
  const [currEmpId,setCurrEmpId]=useState();

  useEffect(() => {
    const jwt = localStorage.getItem("userToken") || "";
    const { sub } = jwtDecode<JwtPayload>(jwt)||"";
    setLoginId(sub);
    const config = {
      headers: { Authorization: "Bearer " + jwt },
    };
    setHeaderConfig(config);

    async function getAllEmp() {
      try {
        const res = await axios.get(
          "http://localhost:8080/admin/employees",
          config
        );
        const res2=await axios.get("http://localhost:8080/notification/"+sub,config);
        setNotification(res2.data);
        setEmpList(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllEmp();
  }, []);
console.log(notification);

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
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getTaskList();
  };
  console.log(empAttributeRating);
  const closeModal = () => {
    setShowModal(false);
    setTaskTableToggle(false);
    reset();
  };
  const { register, handleSubmit, reset } = useForm();

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
    empAttributeRating.map((attribute:AttributeRating)=>{
      const attributeTitle=attribute.attribute;
      async function changeAttributeRating() {
        try {
          attribute.rating=data[attributeTitle];
          const res=await axios.put("http://localhost:8080/admin/employee/attribute/"+currEmpId,attribute,headerConfig);
          console.log(res);
        } catch (error) {
          console.log(error);
        }
        
      }
      changeAttributeRating();
    })
  };

  return (
    <div>
      <Navbar empId={loginId} config={headerConfig} />
      <div className="container-fluid bg-dark-subtle overflow-y-auto p-4 vh-100">
        <form className="d-flex">
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
        <div
          className="modal show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Employee Tasks</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <form className="" onSubmit={handleSubmit(ratingSubmit)}>
                <div className="modal-body">
                  {taskTableToggle && currEmpTaskList && (
                    <>
                      <table className="table table-hover table-success">
                        <thead>
                          <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Project</th>
                            <th scope="col">Work Location</th>
                            <th scope="col">Descriptions</th>
                            <th scope="col">Add/Change Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currEmpTaskList
                            .filter((task: Task) => task.markedForAppraisal)
                            .map((task: Task) => (
                              <tr key={task.taskId}>
                                <td>{task.title}</td>
                                <td>{task.project}</td>
                                <td>{task.workLocation}</td>
                                <td>{task.description}</td>
                                <td>
                                  <select
                                    id="rating"
                                    {...register("" + task.taskId)}
                                    className="form-select m-1"
                                    required
                                  >
                                    <option value=""></option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                        <tfoot></tfoot>
                      </table>

                      <table className="table table-hover table-success">
                        <thead>
                          <tr>
                            <th scope="col">Attribute</th>
                            <th scope="col">Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {empAttributeRating.map(
                            (attribute: AttributeRating) => (
                              <tr>
                                <td>{attribute.attribute}</td>
                                <td>
                                  <select
                                    id="rating"
                                    {...register(""+attribute.attribute)}
                                    className="form-select m-1"
                                    required
                                  >
                                    <option value=""></option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                  </select>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                        <tfoot></tfoot>
                      </table>
                    </>
                  )}
                </div>
                <div className="modal-footer d-flex justify-content-between">
                  <button type="submit" className="btn btn-success m-1">
                    Submit Rating
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

export default AdminDashboard;
