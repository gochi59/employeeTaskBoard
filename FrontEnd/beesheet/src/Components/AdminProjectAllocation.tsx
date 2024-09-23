import React, { useEffect, useState } from "react";
import { Employee, Project, ReduxState } from "../models/AllModels";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import EmployeeCard from "./EmployeeCard";
import Navbar from "./NavbarComponent";
import EmployeeCardSkeleton from "./Skeletons/EmployeeCardSkeleton";
import { Navigate } from "react-router-dom";
import { clearToken } from "../redux/HeaderSlice";
import ToastComponent from "./ToastComponent";

const AdminProjectAllocation = () => {
  const config = useSelector((state: ReduxState) => state.header);
  const id=useSelector((state:ReduxState)=>state.ID);
  const [empList, setEmpList] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [navigateError,setNavigateError]=useState(false);
  const dispatch=useDispatch();
  const [errorPresent,setErrorPresent]=useState("");

  useEffect(() => {
    const getAllEmp = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/admin/employees", config);
        setEmpList(res.data);
      } catch (error:any) {
        console.error("Error fetching employees:", error);
        if (error.message === "Network Error") {
          setErrorPresent("Internal Server Error");
        }
        if(error.response.status===401)
        {
          setNavigateError(true);
        }
        else if(error.response.data==="JWT token is expired."||error.response.data==="Invalid JWT token.")
        {
          dispatch(clearToken());
          localStorage.removeItem("userToken");
        }
      } finally {
        setLoading(false);
      }
    };
    getAllEmp();
  }, []);

  const updateEmployeeProjects = (empId:number, newProjects:string[]) => {
    setEmpList((prevList) =>
      prevList.map((emp) =>
        emp.empId === empId ? { ...emp, projectTitles: newProjects } : emp
      )
    );
  };

  if(!localStorage.getItem("userToken"))
  {
    return <Navigate to="/"></Navigate>
  }
  if(navigateError)
  {
    return <Navigate to="*"></Navigate>
  }
  return (
    <>
    <div className="container-fluid min-vh-100 bg-dark-subtle p-2 pt-md-1 pt-5 overflow-x-hidden">
      <Navbar empId={id} config={config} />
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 mt-5">
        {loading && <EmployeeCardSkeleton />}
        {!loading && empList
          .filter(emp => emp.role === "empl")
          .map(emp => (
            <EmployeeCard
              key={emp.empId}
              emp={emp}
              buttonText="Projects"
              allProjects={emp.projectTitles}
              loading={false}
              updateEmployeeProjects={updateEmployeeProjects}
            />
          ))}
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

export default AdminProjectAllocation;
