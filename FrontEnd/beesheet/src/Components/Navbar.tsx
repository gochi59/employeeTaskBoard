import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  empId: string;
  config: {};
}

const Navbar = ({ empId, config }: Props) => {
  const [notificationList, setNotificationList] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const interval = 100000;

  async function getAllNotifications() {
    try {
      const res = await axios.get(
        "http://localhost:8080/notification/" + empId,
        config
      );
      setNotificationList(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const triggerNotifications = () => {
    getAllNotifications();
    const pollingInterval = setInterval(getAllNotifications, interval);
    return () => clearInterval(pollingInterval);
  };

  const toggleNotificationPanel = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      triggerNotifications();
    }
  };

  return (
    <div className="navbar bg-dark text-bg-dark p-1 position-relative">
      <div className="navbar-brand text-light nav-link">
        <Link
          to="https://www.beehyv.com/"
          className="text-decoration-none text-bg-dark"
        >
          BeeHyv
        </Link>
      </div>
      <div className="">
        <i
          className="fa fa-regular fa-bell btn btn-dark position-relative"
          onClick={toggleNotificationPanel}
        ></i>
        {showNotifications && (
          <div className="notification-panel position-absolute end-0 bg-light shadow p-3 z-2" >
            <h6>Notifications</h6>
            {notificationList.length > 0 ? (
              <ul className="list-group">
                {notificationList.length===0&&<li><p className="text-dark-subtle">No notification</p></li>}
                {notificationList&&notificationList.slice().reverse().map((notification, index) => (
                  <li key={index} className="list-group-item">
                    {notification}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No new notifications</p>
            )}
          </div>
        )}
        <button className="btn btn-dark">Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
