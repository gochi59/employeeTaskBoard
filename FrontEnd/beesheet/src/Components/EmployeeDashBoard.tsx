import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { jwtDecode, JwtPayload } from "jwt-decode";
import axios from "axios";
import { Task } from "../models/AllModels";
import { FieldValues } from "react-hook-form";

const EmployeeDashBoard = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [togalModal, setTogalModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    password: "",
    workLocation: "",
    project: "",
    time: "",
  });

  useEffect(() => {
    const jwtToken = String(localStorage.getItem("userToken"));
    const { sub } = jwtDecode<JwtPayload>(jwtToken);
    const config = {
      headers: { Authorization: "Bearer " + jwtToken },
    };
    async function getTaskList() {
      try {
        const res = await axios.get(
          "http://localhost:8080/tasks/" + sub,
          config
        );
        setTaskList(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getTaskList();
  }, []);

  const addTask = () => {
    setTogalModal(true);
  };


  const handleSubmit = (e: FieldValues) => {
    
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="container-fluid">
        <div className="pt-3">
          {!taskList && <h2>No Tasks Added</h2>}
          {taskList &&
            taskList.map((tasks) => (
              <div className="card p-1 mb-3" key={tasks.id}>
                <div className="card-header">
                  <div className="row justify-content-between">
                    <span className="h5 col-7">{tasks.title}</span>{" "}
                    <button className="btn btn-primary col-1">Edit</button>
                  </div>
                </div>
                <div className="card-body">
                  <p>{tasks.description}</p>
                </div>
                <div className="card-footer">
                  <div className="row justify-content-between">
                    <span className="col-7">
                      Date Added: {tasks.date} Time Spent: {tasks.time} minutes
                    </span>
                    <button className="btn btn-danger col-1">Delete</button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="position-fixed bottom-0 end-0 m-3">
        <button
          className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
          style={{ height: "3rem", width: "3rem" }}
          onClick={addTask}
        >
          <i
            className="fa fa-solid fa-plus text-white"
            style={{ fontSize: "1.5rem" }}
          ></i>
        </button>
      </div>

      {togalModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal show fade d-block" role="dialog" tabIndex="-1">
            <div className="modal-dialog d-flex justify-content-center">
              <div className="modal-content w-75">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel2">
                    Add Task
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setTogalModal(false)}
                  ></button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="modal-body p-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="title">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        
                      />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="description">
                        Description
                      </label>
                      <input
                        type="text"
                        id="description"
                        name="description"
                        className="form-control"
                        value={formData.description}
                        
                      />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="password2">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password2"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        
                      />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="workLocation">
                        Work Location
                      </label>
                      <select
                        name="workLocation"
                        id="workLocation"
                        className="form-select"
                        value={formData.workLocation}
                        
                      >
                        <option value=""></option>
                        <option value="office">Office</option>
                        <option value="home">Home</option>
                      </select>
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="project">
                        Project
                      </label>
                      <input
                        type="text"
                        id="project"
                        name="project"
                        className="form-control"
                        value={formData.project}
                        
                      />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="time">
                        Time
                      </label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        className="form-control"
                        value={formData.time}
                        
                      />
                    </div>
                  </div>
                
                  {/* Submit Button within the Form */}
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary btn-block">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeDashBoard;
