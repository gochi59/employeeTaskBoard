import { useEffect, useState } from "react";
import Navbar from "./NavbarComponent";
import axios from "axios";
import { Project, ReduxState, Task, taskInput } from "../models/AllModels";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { changeToken, clearToken } from "../redux/HeaderSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBuilding,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import ToastComponent from "./ToastComponent";
import EmployeeCardSkeleton from "./Skeletons/EmployeeCardSkeleton";
import { Navigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import { jwtDecode, JwtPayload } from "jwt-decode";

const EmployeeDashBoard = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [togalModal, setTogalModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [modalText, setModalText] = useState<boolean>();
  const [currTask, setCurrTask] = useState<Task>();
  const [projectList, setProjectList] = useState<Project[]>();
  const [errorPresent, setErrorPresent] = useState<string>("");
  const [currPageNumber,setCurrPageNumber]=useState(0);
  const [lastPage,setLastPage]=useState(1000);
  const [navigateToError,setNavigateToError]=useState(false);
  const [empId,setEmpId]=useState("");
  // console.log(empId,config);

  const dispatch = useDispatch();

  useEffect(() => {
    if (errorPresent) {
      const timer = setTimeout(() => {
        setErrorPresent("");
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [errorPresent]);

  const schema = z.object({
    title: z.string().min(1, { message: "This is a required field" }).max(50,{message:"word limit reached"}).trim().min(1,{message:"String cant be only white spaces"}),
    description: z.string().min(1, { message: "This is a required field" }).max(100,{message:"word limit reached"}).trim().min(1,{message:"String cant be only white spaces"}),
    workLocation: z.string().min(1, { message: "This is a required field" }),
    project: z.string().min(1, { message: "This is a required field" }),
    time: z
      .string()
      .time({ message: "Enter time in valid format: 00:00:00 (hr:min:sec)" }),
    markedForAppraisal: z.boolean(),
    date: z
      .string()
      .min(1, { message: "This is a required field" })
      .transform((str) => new Date(str)),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<taskInput>({ resolver: zodResolver(schema) });

  async function getTaskList(currEmpId:string) {
    setLoader(true);
    try {
      const paginationInput = {
        pageNumber: currPageNumber,
        pageSize: 3,
      };
      const currEmpId=jwtDecode<JwtPayload>(localStorage.getItem("userToken")||"").sub||"";
      const res = await axiosInstance.get("/tasks/" + currEmpId, {
        params: paginationInput,
      });
      setLastPage(res.data.totalPages);
      setTaskList(res.data.content);
      // console.log(res);    
    } catch (error: any) {
      console.log(error);
      if ((error.message as string).includes("Invalid token specified:")) {
          setNavigateToError(true);
        }
      if (error.message === "Network Error") {
        setErrorPresent("Internal Server Error");
      }
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

  async function getProjectList(currEmpId:string) {
    // console.log(empId,config);

    try {
      const res = await axiosInstance.get(
        "/" + currEmpId + "/project"
      );
      // console.log(res.data)
      setProjectList(res.data);
    } catch (error: any) {
      console.log(error);
      if ((error.message as string).includes("Invalid token specified:")) {
        setNavigateToError(true);
      }
      if (error.message === "Network Error") {
        setErrorPresent("Internal Server Error");
      }
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
  useEffect(() => {
    setLoader(true);
    try {
      const currEmpId=jwtDecode<JwtPayload>(localStorage.getItem("userToken")||"").sub||"";
      setEmpId(currEmpId);
      getTaskList(currEmpId);
      getProjectList(currEmpId);
    } catch (error) {
      if ((error.message as string).includes("Invalid token specified:")) {
        setNavigateToError(true);
      }
    }
   
  }, [currPageNumber]);
  // console.log(taskList);

  const addTask = () => {
    reset({
      title: "",
      markedForAppraisal: false,
      workLocation: "",
      project: "",
      time: "",
      description: "",
      date: "",
    });
    setTogalModal(true);
    setModalText(true);
  };

  const handleSub = async (e: FieldValues) => {
    console.log(currTask);
    const task = {
      title: e.title,
      markedForAppraisal:
        e.markedForAppraisal === undefined ? false : e.markedForAppraisal,
      workLocation: e.workLocation,
      project: e.project,
      time: e.time,
      description: e.description,
      date: e.date,
      taskId: currTask?.taskId,
    };
    console.log(task);

    if (modalText) {
      try {
        await axiosInstance.post("/tasks/" + empId, task);
        setTaskList([...taskList, task]);
        reset();
        setTogalModal(false);
        console.log(taskList, "Aa");
        getTaskList();
      } catch (error: any) {
        console.log(error);
        if ((error.message as string).includes("Invalid token specified:")) {
          setNavigateToError(true);
        }
        if (error.message === "Network Error") {
          setTogalModal(false);
          setErrorPresent(error.message);
        }
        if (
          error.response.data === "JWT token is expired." ||
          error.response.data === "Invalid JWT token."||error.response.data==="Unable to refresh token") {
          dispatch(clearToken());
          localStorage.removeItem("userToken");
        }
      }
    } else {
      try {
        console.log(currTask);

        const res = await axiosInstance.put(
          "/task/" + empId + "/" + currTask?.taskId,
          task
        );
        const editTaskList = taskList.map((t) =>
          t.taskId === currTask?.taskId ? task : t
        );
        setTaskList(editTaskList);
        console.log(res);
        setTogalModal(false);
      } catch (error: any) {
        if ((error.message as string).includes("Invalid token specified:")) {
          setNavigateToError(true);
        }
        if (error.message === "Network Error") {
          setTogalModal(false);
          setErrorPresent(error.message);
        }
        if (error.response.data === "java.lang.IllegalAccessException") {
          setErrorPresent("Cannot edit rated task");
          setTogalModal(false);
        }
        // if (
        //   error.response.data === "JWT token is expired." ||
        //   error.response.data === "Invalid JWT token."
        // ) {
        //   dispatch(clearToken());
        //   localStorage.removeItem("userToken");
        // }
        console.log(error);
      }
    }
  };

  const deleteTask = (id: number) => {
    console.log(id);
    // const id = task.taskId;
    async function deleteTaskFunc() {
      try {
        const res = await axiosInstance.delete(
          "/task/" + empId + "/" + id
        );
        // console.log(res);
        setTaskList(taskList.filter((t) => t.taskId !== id));
      } catch (error: any) {
        if ((error.message as string).includes("Invalid token specified:")) {
          setNavigateToError(true);
        }
        if (error.message === "Network Error") {
          setErrorPresent("Internal Server Error");
        }
        if (error.response.data === "java.lang.IllegalAccessException") {
          setErrorPresent("Cannot delete rated task");
        }
        if (
          error.response.data === "JWT token is expired." ||
          error.response.data === "Invalid JWT token."
        ) {
          dispatch(clearToken());
          localStorage.removeItem("userToken");
        }
        console.log(error);
      }
    }
    deleteTaskFunc();
  };
  const editTask = (task: Task) => {
    setModalText(false);
    setTogalModal(true);
    console.log(task);
    setCurrTask(task);
    const taskDate = new Date(task.date).toISOString().split("T")[0];

    reset({
      title: task.title,
      markedForAppraisal:
        task.markedForAppraisal === undefined ? false : task.markedForAppraisal,
      workLocation: task.workLocation,
      project: task.project,
      time: task.time,
      description: task.description,
      date: taskDate,
    });
  };

  const nextPageTogal=()=>{
    setCurrPageNumber(currPageNumber+1);
  }

  const prevPageTogal=()=>{
    setCurrPageNumber(currPageNumber-1);
  }
  
  if (!localStorage.getItem("userToken")) {
    return <Navigate to="/"></Navigate>;
  }
  if (navigateToError) {
    return <Navigate to="*" replace={false} />;
  }
  return (<>
      <Navbar ></Navbar>
    <div className="bg-dark-subtle min-vh-100 pt-5 pt-md-4 mt-md-4 mt-5">
      <div className="container-fluid ">
        <div className="py-3 ">
          {loader && <EmployeeCardSkeleton />}
          {!loader && (
            <>
              {taskList.length == 0 && <h2>No Tasks Added</h2>}
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
                          {tasks.workLocation === "office" && (
                            <OverlayTrigger
                              delay={{ hide: 450, show: 200 }}
                              overlay={(props) => (
                                <Tooltip {...props}>Office</Tooltip>
                              )}
                            >
                              <FontAwesomeIcon
                                icon={faBuilding}
                                className="ps-1"
                              />
                            </OverlayTrigger>
                          )}
                          {tasks.workLocation === "home" && (
                            <OverlayTrigger
                              delay={{ hide: 450, show: 200 }}
                              overlay={(props) => (
                                <Tooltip {...props}>Home</Tooltip>
                              )}
                            >
                              <FontAwesomeIcon
                                icon={faHouse}
                                className="ps-1"
                              />
                            </OverlayTrigger>
                          )}
                        </span>{" "}
                        <button
                          className="btn btn-primary col-lg-1 col-auto h-25 h-md-100"
                          disabled={tasks.taskRating ? true : false}
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
                        <span className="col-md-7 col-auto">
                          <span>
                          Date Added: {String(tasks.date).slice(0,10)}
                          </span>
                          <span>
                          Time Spent: {tasks.time}
                          </span>
                        </span>
                        <button
                          className="btn btn-danger col-lg-1 col-auto h-25 h-md-100"
                          onClick={() => deleteTask(tasks.taskId)}
                          disabled={tasks.taskRating ? true : false}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>

        <div className="position-fixed bottom-0 end-0 mb-5">
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
              className="modal  show fade d-block"
              role="dialog"
              tabIndex={-1}
            >
              <div className="modal-dialog d-flex justify-content-center">
                <div className="modal-content w-100 ">
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
                      className="modal-body p-3"
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
                        <label htmlFor="project" className="form-label">
                          Project:{" "}
                        </label>
                        <select
                          {...register("project")}
                          className="form-select"
                        >
                          <option value=""></option>
                          {projectList &&
                            projectList.map((project: Project) => (
                              <option key={project.id} value={project.name}>
                                {project.name}
                              </option>
                            ))}
                        </select>
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
        {errorPresent && (
          <ToastComponent
            closeMessage={() => setErrorPresent("")}
            errorPresent={errorPresent}
          ></ToastComponent>
        )}
      </div>
      <div className="d-flex justify-content-between px-2 pb-1  ">
        <span className="position-fixed bottom-0 start-0 ps-1">
          {currPageNumber>0&&<FontAwesomeIcon icon={faArrowLeft} className="btn btn-dark" onClick={prevPageTogal} />}
        </span>
        <span className="position-fixed bottom-0 end-0 pe-1">
          {lastPage>0&&currPageNumber!==lastPage-1&&<FontAwesomeIcon icon={faArrowRight} className="btn btn-dark" onClick={nextPageTogal}/>}
        </span>
      </div>
    </div>
    </>
  );
};

export default EmployeeDashBoard;
