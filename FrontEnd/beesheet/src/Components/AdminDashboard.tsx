import { useEffect, useState } from "react";
import Navbar from "./NavbarComponent";
import axios from "axios";
import { Employee, ReduxState, Task } from "../models/AllModels";
import { useDispatch, useSelector } from "react-redux";
import { changeToken } from "../redux/HeaderSlice";
import EmployeeCard from "./EmployeeCard";
import EmployeeCardSkeleton from "./Skeletons/EmployeeCardSkeleton";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const [empList, setEmpList] = useState<Employee[]>();
  const headerConfig = useSelector((state: ReduxState) => state.header);
  const loginId = useSelector((state: ReduxState) => state.ID);
  const [navigateToError,setNavigateToError]=useState(false);

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
        setEmpList(res.data);
      } catch (error) {
        console.log(error);
        if(error.response.status===401)
        {
          setNavigateToError(true);
        }
      }
    }
    getAllEmp();
  }, []);

  if(navigateToError)
  {
    return <Navigate to="*" replace={false}/>
  }

  return (
    <>
      <Navbar empId={loginId} config={headerConfig} />
      <div>
        <div className="container-fluid bg-dark-subtle p-2 pb-3 vh-100 overflow-x-hidden rounded-1">
          <form className="d-flex justify-content-end">
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

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
            {!empList && <EmployeeCardSkeleton />}
            {empList &&
              empList
                .filter((emp: Employee) => {
                  const empDate = new Date(emp.doj).getFullYear();
                  const currDate = new Date().getFullYear();
                  return (
                    empDate <= currDate - 1 &&
                    emp.role !== "ADMIN" &&
                    emp.empTask.some((task: Task) => task.markedForAppraisal) &&
                    !emp.apprasailDone
                  );
                })
                .map((emp: Employee) => (
                  <EmployeeCard
                    key={emp.empId}
                    emp={emp}
                    buttonText={"Tasks"}
                    allProjects={emp.projectTitles}
                    loading={true}
                  />
                ))}
            {empList &&
              empList
                .filter((emp: Employee) => {
                  const empDate = new Date(emp.doj).getFullYear();
                  const currDate = new Date().getFullYear();
                  return (
                    empDate <= currDate - 1 &&
                    emp.role !== "ADMIN" &&
                    emp.empTask.some((task: Task) => task.markedForAppraisal) &&
                    emp.apprasailDone
                  );
                })
                .map((emp: Employee) => (
                  <EmployeeCard
                    key={emp.empId}
                    emp={emp}
                    buttonText={"Tasks"}
                    allProjects={emp.projectTitles}
                    loading={true}
                  />
                ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
