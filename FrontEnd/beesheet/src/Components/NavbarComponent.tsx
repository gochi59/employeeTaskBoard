import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import { clearToken } from "../redux/HeaderSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faCross, faX } from "@fortawesome/free-solid-svg-icons";
import ToastComponent from "./ToastComponent";
import {
  AttributeRating,
  Employee,
  Notifications,
  Task,
} from "../models/AllModels";
import TaskAttributeRating from "./TaskAttributeRating";
import axiosInstance from "../axios/axiosInstance";

interface Props {
  empId: string;
  config: {};
}

const Navbar = ({ empId, config }: Props) => {
  const [notificationList, setNotificationList] = useState<Notifications[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const internalRef = useRef<number | null>(null);
  const dispatch = useDispatch();
  const [logoutToggle, setLogoutToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [homeToggle, setHomeToggle] = useState<boolean>(false);
  const [errorPresent, setErrorPresent] = useState<string>("");
  const [toggleToAdminApproval, setTogalToAdminApproval] = useState(false);
  const [showTaskAttributeModal, setShowTaskAttributeModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState<number>();
  const [currEmpTaskList, setCurrEmpTaskList] = useState<Task[]>([]);
  const [empAttributeRating, setEmpAttributeRating] = useState<
    AttributeRating[]
  >([]);
  const [currEmp, setCurrEmp] = useState<Employee>();
  const [togalToTasks, setTogalToTasks] = useState(false);
  const location = useLocation();
  const interval = 5000;

  async function getTaskList(empId: number) {
    try {
      const res = await axiosInstance.get(`/tasks/${empId}`, {
        params: {
          pageNumber: 0,
          pageSize: 100000,
        },
      });
      const res2 = await axiosInstance.get(
        `/admin/employee/attribute/${empId}`
      );
      setEmpAttributeRating(res2.data);
      setCurrEmpTaskList(res.data.content);
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

  async function getAttributeRating(empId: number) {
    try {
      // const res = await axios.get(
      //   `http://localhost:8080/admin/employee/attribute/${empId}`,
      //   config
      // );
      const res=await axiosInstance.get("/admin/employee/attribute/"+empId);
      setCurrEmp(res.data);
    } catch (error: any) {
      console.log(error);
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

  async function getEmpDetails(empId: number) {
    try {
      // const res = await axios.get(
      //   `http://127.0.0.1:8080/employee/${empId}`,
      //   config
      // );
      const res=await axiosInstance.get(`/employee/${empId}`);
      setCurrEmp(res.data);
    } catch (error: any) {
      // if (
      //   error.response.data === "JWT token is expired." ||
      //   error.response.data === "Invalid JWT token."
      // ) {
      //   dispatch(clearToken());
      //   localStorage.removeItem("userToken");
      // }
    }
  }

  async function getAllNotifications() {
    setLoader(true);
    try {
      const res = await axiosInstance.get("/notification/"+empId);
      setNotificationList(res.data);
    } catch (error: any) {
      console.log(error);
      
    } finally {
      setLoader(false);
    }
  }

  const stopPolling = () => {
    if (internalRef.current) {
      clearInterval(internalRef.current);
      internalRef.current = null;
    }
  };

  // console.log(notificationList);

  const startPolling = () => {
    getAllNotifications();
    internalRef.current = setInterval(getAllNotifications, interval);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const clearAllNotifications = async () => {
    setLoader(true);
    try {
      // await axios.delete(
      //   "http://localhost:8080/notifications/" + empId,
      //   config
      // );
      await axiosInstance.delete("/notifications/"+empId);
      setNotificationList([]);
    } catch (error: any) {
      console.log(error);
      if (error.message === "Network Error") {
        return <div className="h1 text-center">Internal Server Error</div>;
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!localStorage.getItem("userToken")) {
    return <Navigate to="/"></Navigate>;
  }
  const logout = async() => {
    await axiosInstance.delete("/removecookie");
    localStorage.removeItem("userToken");
    dispatch(clearToken());
    if (internalRef.current !== null) {
      clearInterval(internalRef.current);
    }
    setLogoutToggle(true);
  };

  if (logoutToggle) {
    return <Navigate to="/" />;
  }

  const home = () => {
    setHomeToggle(true);
  };

  if (homeToggle) {
    if (location.pathname != "/home") {
      return <Navigate to="/home" />;
    }
  }

  const toggleNotificationEvent = (empIddd: number, message: string) => {
    if (message.includes("signed")) {
      setTogalToAdminApproval(true);
    } else if (message.includes("approval")) {
      setSelectedEmpId(empIddd);
      setShowTaskAttributeModal(true);
      getTaskList(empIddd);
      getAttributeRating(empIddd);
      getEmpDetails(empIddd);
    } else if (message.includes("Admin")) {
      setTogalToTasks(true);
    }
  };

  const deleteThisNotif = async (id: number) => {
    setLoader(true);
    try {
      // await axios.delete("http://localhost:8080/notification/"+id,config);
      await axiosInstance.delete("/notification/" + id);
      setNotificationList(notificationList.filter((notif) => notif.id != id));
    } catch (error: any) {
      if (error.message === "Network Error") {
        return <div className="h1 text-center">Internal Server Error</div>;
      }
    } finally {
      setLoader(false);
    }
  };

  if (togalToTasks && location.pathname != "/user") {
    return <Navigate to="/user" />;
  }
  if (toggleToAdminApproval && location.pathname != "/admin/approval") {
    return <Navigate to="/admin/approval" />;
  }
  // console.log(notificationList);
  return (
    <div className="navbar bg-dark text-bg-dark px-2 fixed-top d-flex justify-content-between align-items-center">
      <div className="navbar-brand text-light">
        <Link
          to="https://www.beehyv.com/"
          className="text-decoration-none text-bg-dark"
        >
          BeeHyv
        </Link>
      </div>
      <div className="d-flex align-items-center ms-auto">
        {
          <>
            <i
              className="fa fa-regular fa-bell btn btn-dark position-relative me-3"
              onClick={toggleNotifications}
            >
              {notificationList.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {notificationList.length}
                </span>
              )}
            </i>
            {showNotifications && (
              <div
                ref={notificationRef}
                className="position-absolute end-0 top-100 mt-2 bg-light shadow rounded border"
                style={{ width: "320px", maxHeight: "400px" }}
              >
                <div className="p-2 d-flex justify-content-between align-items-center bg-light">
                  <h5 className="mb-0 text-dark">Notifications</h5>
                  <span>
                    <button
                      className="btn px-2 btn-sm btn-danger"
                      onClick={clearAllNotifications}
                      disabled={notificationList.length === 0 || loader}
                    >
                      Clear All
                    </button>
                    <FontAwesomeIcon
                      className="px-2 btn btn-light"
                      icon={faX}
                      color="black"
                      onClick={() => setShowNotifications(false)}
                    />
                  </span>
                </div>

                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {loader && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                      <div
                        className="spinner-border spinner-border-sm text-light"
                        role="status"
                      ></div>
                    </span>
                  )}
                  {notificationList.length > 0 ? (
                    <ul className="list-group">
                      {notificationList
                        .slice()
                        .reverse()
                        .map((notification: Notifications) => (
                          <li
                            key={notification.id}
                            className="list-group-item d-flex align-items-center "
                          >
                            <span className="d-flex justify-content-between">
                              <span
                                className="btn"
                                onClick={() =>
                                  toggleNotificationEvent(
                                    notification.empId,
                                    notification.message
                                  )
                                }
                              >
                                {notification.message}
                              </span>
                              <button
                                className="btn btn-danger ms-5 px-auto pb-1 my-auto"
                                disabled={loader}
                                onClick={() => deleteThisNotif(notification.id)}
                              >
                                <FontAwesomeIcon icon={faX} />
                              </button>
                            </span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-center p-2 text-dark">
                      No new notifications
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        }
        <button className="btn btn-dark ms-3" onClick={home}>
          Home
        </button>
        <button className="btn btn-dark ms-3" onClick={logout}>
          Logout
        </button>
      </div>
      {errorPresent && (
        <ToastComponent
          closeMessage={() => setErrorPresent("")}
          errorPresent={errorPresent}
        ></ToastComponent>
      )}
      {showTaskAttributeModal && selectedEmpId && (
        <TaskAttributeRating
          closeModal={() => setShowTaskAttributeModal(false)}
          currEmpTaskList={currEmpTaskList}
          empAttributeRating={empAttributeRating}
          currEmpId={currEmp}
          currAttributeList={empAttributeRating}
        />
      )}
    </div>
  );
};

export default Navbar;
