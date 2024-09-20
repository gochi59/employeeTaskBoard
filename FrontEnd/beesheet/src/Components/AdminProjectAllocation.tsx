import React, { useEffect, useState } from "react";
import { Employee, Project, ReduxState } from "../models/AllModels";
import { useSelector } from "react-redux";
import axios from "axios";
import EmployeeCard from "./EmployeeCard";
import Navbar from "./NavbarComponent";
import EmployeeCardSkeleton from "./Skeletons/EmployeeCardSkeleton";

const AdminProjectAllocation = () => {
  const config = useSelector((state: ReduxState) => state.header);
  const id=useSelector((state:ReduxState)=>state.ID);
  const [empList, setEmpList] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllEmp = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/admin/employees", config);
        setEmpList(res.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };
    getAllEmp();
  }, [config]);

  return (
    <div className="container-fluid min-vh-100 bg-dark-subtle p-2 overflow-x-hidden">
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
            />
          ))}
      </div>
    </div>
  );
};

export default AdminProjectAllocation;
