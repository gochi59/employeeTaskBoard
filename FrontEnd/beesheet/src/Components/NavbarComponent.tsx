import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import { clearToken } from "../redux/HeaderSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faCross, faX } from "@fortawesome/free-solid-svg-icons";

interface Props {
  empId: string;
  config: {};
}

const Navbar = ({ empId, config }: Props) => {
  const [notificationList, setNotificationList] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const internalRef = useRef<number | null>(null);
  const dispatch = useDispatch();
  const [logoutToggle, setLogoutToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [homeToggle, setHomeToggle] = useState<boolean>(false);
const location=useLocation();
  const interval = 10000;

  async function getAllNotifications() {
    setLoader(true);
    try {
      const res = await axios.get(
        "http://localhost:8080/notification/" + empId,
        config
      );
      setNotificationList(res.data);
    } catch (error) {
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
      await axios.delete("http://localhost:8080/notification/" + empId, config);
      setNotificationList([]);
    } catch (error) {
      console.log(error);
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

  const logout = () => {
    localStorage.removeItem("userToken");
    dispatch(clearToken());
    setLogoutToggle(true);
  };

  if (logoutToggle) {
    return <Navigate to="/" />;
  }

  const home = () => {
    setHomeToggle(true);
  };

  if (homeToggle) {
    if(location.pathname!="/home")
    {return <Navigate to="/home" />;}
  }

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
      <div className="d-flex align-items-center">
        { (
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
                  <FontAwesomeIcon className="px-2 btn btn-light" icon={faX} color="black" onClick={()=>setShowNotifications(false)}/>
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
                        .map((notification, index) => (
                          <li
                            key={index}
                            className="list-group-item d-flex align-items-center"
                          >
                            {notification}
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
        )}
        <button className="btn btn-dark ms-3" onClick={home}>
          Home
        </button>
        <button className="btn btn-dark ms-3" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
