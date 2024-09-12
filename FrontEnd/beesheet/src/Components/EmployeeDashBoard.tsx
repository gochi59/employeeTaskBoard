import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { jwtDecode, JwtPayload } from "jwt-decode";
import axios from "axios";
import { Task, taskInput } from "../models/AllModels";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const EmployeeDashBoard = () => {

  const [taskList, setTaskList] = useState<Task[]>([]);
  const [togalModal, setTogalModal] = useState(false);
  const [jwt, setJwt] = useState("");
  const [empEmail, setEmpEmail] = useState<String | undefined>("");
  const [headerConfig, setHeaderConfig] = useState({});
  const [modalText, setModalText] = useState<boolean>();
  const [currTask, setCurrTask] = useState<Task>();
  const locationEnum = ["office", "home"];
  

  const schema = z.object({
    title: z.string().min(1, { message: "This is a required field" }),
    description: z.string().min(1, { message: "This is a required field" }),
    workLocation: z.enum(locationEnum as [string, ...string[]], {
      message: "Select a valid work location",
    }),
    project: z.string().min(1, { message: "This is a required field" }),
    time: z
      .string()
      .time({ message: "Enter time in valid format: 00:00:00 (hr:min:sec)" }),
    markedForAppraisal: z.boolean(),
    date: z.string().min(1, { message: "Select a date" }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<taskInput>({ resolver: zodResolver(schema) });


  useEffect(() => {
    const jwtToken = String(localStorage.getItem("userToken"));
    setJwt(jwtToken);
    const { sub } = jwtDecode<JwtPayload>(jwtToken);
    setEmpEmail(sub);
    const config = {
      headers: { Authorization: "Bearer " + jwtToken },
    };
    setHeaderConfig(config);
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
    reset({
      title: "",
      markedForAppraisal: false,
      workLocation: "office",
      project: "",
      time: "",
      description: "",
      date: "",
    });
    setTogalModal(true);
    setModalText(true);
  };

  const handleSub = async (e: FieldValues) => {
    const task = {
      title: e.title,
      markedForAppraisal:
        e.markedForAppraisal === undefined ? false : e.markedForAppraisal,
      workLocation: e.workLocation,
      project: e.project,
      time: e.time,
      description: e.description,
      date: e.date,
    };
     
    if(modalText) {
      try {
        const res = await axios.post(
          "http://localhost:8080/tasks/" + empEmail,
          task,
          headerConfig
        );
        setTaskList([...taskList, task]);
        reset();
        setTogalModal(false);
      } catch (error) {
        console.log(error);
      }
    }
    else {
      try {
        const res = await axios.put(
          "http://localhost:8080/task/" + empEmail + "/" + currTask?.taskId,
          task,
          headerConfig
        );
        const editTaskList=taskList.map(t=>t.taskId===currTask?.taskId?task:t);
        setTaskList(editTaskList);
        console.log(res);
        setTogalModal(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteTask = async (task: Task) => {
    console.log(task);
    const id = task.taskId;
    console.log(typeof empEmail, typeof id);
    try {
      const res = await axios.delete(
        "http://localhost:8080/task/" + empEmail + "/" + id,
        headerConfig
      );
      console.log(res);
      setTaskList(taskList.filter(t=>t.taskId!==id));
    } catch (error) {                       
      console.log(error);
    }
  };
  const editTask = (task: Task) => {
    setModalText(false);
    setTogalModal(true);
    setCurrTask(task);
    reset({
      title: task.title,
      markedForAppraisal:
        task.markedForAppraisal === undefined ? false : task.markedForAppraisal,
      workLocation: task.workLocation,
      project: task.project,
      time: task.time,
      description: task.description,
      date: task.date,
    });
  };

  return (
    <div className="bg-dark-subtle vh-100 overflow-y-scroll">
      <Navbar></Navbar>
      <div className="container-fluid  ">
        <div className="py-3">
          {!taskList && <h2>No Tasks Added</h2>}
          {taskList &&
            taskList.map((tasks: Task) => (
              <div
                className="card p-1 mb-3 bg-body-secondary"
                key={tasks.taskId}
              >
                <div className="card-header">
                  <div className="row justify-content-between">
                    <span className="h5 col-7">
                      {tasks.title}{" "}
                      {tasks.markedForAppraisal && (
                        <OverlayTrigger
                          delay={{ hide: 450, show: 200 }}
                          overlay={(props) => (
                            <Tooltip {...props}>
                              Task marked for appraisal.
                            </Tooltip>
                          )}
                        >
                          <i
                            className="fa fa-solid fa-check"
                            style={{ color: "green" }}
                          ></i>
                        </OverlayTrigger>
                      )}
                    </span>{" "}
                    <button
                      className="btn btn-primary col-1"
                      onClick={() => {
                        editTask(tasks);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <p>{tasks.description}</p>
                </div>
                <div className="card-footer">
                  <div className="row justify-content-between">
                    <span className="col-7">
                      Date Added: {tasks.date} Time Spent: {tasks.time}
                    </span>
                    <button
                      className="btn btn-danger col-1"
                      onClick={() => deleteTask(tasks)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
            <div
              className="modal show fade d-block"
              role="dialog"
              tabIndex={-1}
            >
              <div className="modal-dialog d-flex justify-content-center">
                <div className="modal-content w-75">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel2">
                      {modalText && <span>Add Task</span>}
                      {!modalText && <span>Edit Task</span>}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setTogalModal(false)}
                    ></button>
                  </div>

                  <form onSubmit={handleSubmit(handleSub)}>
                    <div
                      className="modal-body p-4"
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="title">
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          className="form-control"
                          {...register("title")}
                        />
                        {errors.title && (
                          <p className="text-danger">{errors.title.message}</p>
                        )}
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="description">
                          Description
                        </label>
                        <input
                          type="text"
                          id="description"
                          className="form-control"
                          {...register("description")}
                        />
                        {errors.description && (
                          <p className="text-danger">
                            {errors.description.message}
                          </p>
                        )}
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="workLocation">
                          Work Location
                        </label>
                        <select
                          {...register("workLocation")}
                          id="workLocation"
                          className="form-select"
                        >
                          <option value=""></option>
                          <option value="office">Office</option>
                          <option value="home">Home</option>
                        </select>
                        {errors.workLocation && (
                          <p className="text-danger">
                            {errors.workLocation.message}
                          </p>
                        )}
                      </div>
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="project">
                          Project
                        </label>
                        <input
                          type="text"
                          id="project"
                          {...register("project")}
                          className="form-control"
                        />
                        {errors.project && (
                          <p className="text-danger">
                            {errors.project.message}
                          </p>
                        )}
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="date">
                          Date
                        </label>
                        <input
                          placeholder="00:00:00"
                          type="date"
                          id="time"
                          {...register("date")}
                          className="form-control"
                        />
                        {errors.date && (
                          <p className="text-danger">{errors.date.message}</p>
                        )}
                      </div>
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="time">
                          Time Spent
                        </label>
                        <input
                          placeholder="00:00:00"
                          type="text"
                          id="time"
                          {...register("time")}
                          className="form-control"
                        />
                        {errors.time && (
                          <p className="text-danger">{errors.time.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="modal-footer justify-content-between">
                      <div className="ms-3">
                        <input
                          type="checkbox"
                          {...register("markedForAppraisal")}
                          id="markedForAppraisal"
                          className=""
                        />
                        <label htmlFor="markedForAppraisal" className="p-1">
                          Mark for Appraisal
                        </label>
                      </div>
                      <div className="me-3 pe-1">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashBoard;
