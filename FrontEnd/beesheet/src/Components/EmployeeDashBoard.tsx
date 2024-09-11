import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { jwtDecode, JwtPayload } from "jwt-decode";
import axios from "axios";
import { Task } from "../models/AllModels";

const EmployeeDashBoard = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);
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
  console.log(taskList);
  return (
    <div>
      <Navbar></Navbar>
      <div className="container-fluid">
        <div className="pt-3">
          {!taskList && <h2>No Tasks Added</h2>}
          {taskList && taskList.map((tasks) => <div className="card p-1 mb-3">
            <div className="card-header"><div className="row justify-content-between"><span className="h5 col-7">{tasks.title}</span> <button className="btn btn-primary col-1">Edit</button></div></div>
            <div className="card-body"><p>{tasks.description}</p></div>
            <div className="card-footer"><div className="row justify-content-between"><span className="col-7">Date Added: {tasks.date} Time Spent: {tasks.time} minutes</span><button className="btn btn-danger col-1">Delete</button></div></div>
          </div>)}
        </div>
      </div>
      <div className="position-fixed bottom-0 end-0 m-3">
        <button
          className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
          style={{ height: "3rem", width: "3rem" }}
        >
          <i
            className="fa fa-solid fa-plus text-white"
            style={{ fontSize: "1.5rem" }}
          ></i>
        </button>
      </div>    </div>
  );
};

export default EmployeeDashBoard;
