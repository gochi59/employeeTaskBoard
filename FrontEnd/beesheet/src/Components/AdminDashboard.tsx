import { useEffect, useState } from "react";
import Navbar from "./NavbarComponent";
import axios from "axios";
import { Employee, ReduxState, Task } from "../models/AllModels";
import { useDispatch, useSelector } from "react-redux";
import { changeToken, clearToken } from "../redux/HeaderSlice";
import EmployeeCard from "./EmployeeCard";
import EmployeeCardSkeleton from "./Skeletons/EmployeeCardSkeleton";
import { Navigate } from "react-router-dom";
import ToastComponent from "./ToastComponent";
import axiosInstance from "../axios/axiosInstance";

const AdminDashboard = () => {
  const [empList, setEmpList] = useState<Employee[]>();
  const headerConfig = useSelector((state: ReduxState) => state.header);
  const loginId = useSelector((state: ReduxState) => state.ID);
  const [navigateToError,setNavigateToError]=useState(false);
  const [errorPresent,setErrorPresent]=useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeToken());
  }, []);

  useEffect(() => {
    async function getAllEmp() {
      try {
        const res = await axiosInstance.get(
          "/admin/employees"
        );
        setEmpList(res.data);
      } catch (error:any) {
        console.log(error);
        if ((error.message as string).includes("Invalid token specified:")) {
          setNavigateToError(true);
        }
        if (error.message === "Network Error") {
          setErrorPresent("Internal Server Error");
        }
        if(error.response.status===401||error.response.status===403)
        {
          console.log(typeof error)
          setNavigateToError(true);
        }
        else if(error.response.data==="JWT token is expired."||error.response.data==="Invalid JWT token.")
          {
            dispatch(clearToken());
            localStorage.removeItem("userToken");
          }
      }
    }
    getAllEmp();
  }, []);

  if (!localStorage.getItem("userToken")) {
    return <Navigate to="/"></Navigate>;
  }
  if(navigateToError)
  {
    return <Navigate to="*" replace={false}/>
  }

  return (
    <>
      <Navbar  />
      <div>
        <div className="container-fluid bg-dark-subtle p-2 mt-5 pt-md-1 pt-5 pb-3 vh-100 overflow-x-hidden rounded-1">
         

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
                    loading={true} updateEmployeeProjects={function (emp: number, projects: string[]): void {
                      throw new Error("Function not implemented.");
                    } }                  />
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
                    loading={true} updateEmployeeProjects={function (emp: number, projects: string[]): void {
                      throw new Error("Function not implemented.");
                    } }                  />
                ))}
          </div>
        </div>
      </div>
      {errorPresent && (
          <ToastComponent
            closeMessage={() => setErrorPresent("")}
            errorPresent={errorPresent}
          ></ToastComponent>
        )}
    </>
  );
};

export default AdminDashboard;
