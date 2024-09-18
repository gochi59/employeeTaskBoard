import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  empId: string;
  config: {};
}

const Navbar = ({ empId, config }: Props) => {
  const [notificationList, setNotificationList] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const internalRef = useRef<number | null>(null);
  const interval = 10000; 

  async function getAllNotifications() {
    try {
      const res = await axios.get(
        "http://localhost:8080/notification/" + empId,
        config
      );
      console.log("called");
      
      setNotificationList(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const startPolling = () => {
    getAllNotifications();
    if (internalRef.current) {
      clearInterval(internalRef.current);
    }
    internalRef.current = setInterval(getAllNotifications, interval);
  };

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

  useEffect(() => {
    if (showNotifications) {
      startPolling();
    } 
    return () => startPolling();
  }, [showNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            style={{ width: '300px', maxHeight: '400px', overflowY: 'auto' }}
          >
            {notificationList.length > 0 ? (
              <ul className="list-group">
                {notificationList.slice().reverse().map((notification, index) => (
                  <li key={index} className="list-group-item d-flex align-items-center">
                    {notification}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center p-2">No new notifications</p>
            )}
          </div>
        )}
        <button className="btn btn-dark ms-3">Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
