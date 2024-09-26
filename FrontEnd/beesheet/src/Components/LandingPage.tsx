import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Employee, ReduxState } from "../models/AllModels";
import axiosInstance from "../axios/axiosInstance"; // Use the interceptor-based axios instance
import { Navigate } from "react-router-dom";
import EmployeeCardSkeleton from "./Skeletons/EmployeeCardSkeleton";
import ToastComponent from "./ToastComponent";
import NavbarComponent from "./NavbarComponent";
import { jwtDecode, JwtPayload } from "jwt-decode";

const LandingPage = () => {
  const config = useSelector((state: ReduxState) => state.header);

  const [currEmp, setCurrEmp] = useState<Employee>();
  const [navigateToEmp, setNavigateToEmp] = useState<boolean>(false);
  const [navigateToAdminProject, setNavigateToAdminProject] =
    useState<boolean>(false);
  const [navigateToAdminAppraisal, setNavigateToAdminAppraisal] =
    useState<boolean>(false);
  const [empApproval, setEmpApproval] = useState<boolean>(false);
  const [loader, setLoader] = useState(false);
  const [errorPresent, setErrorPresent] = useState("");
  const [navigateToError, setNavigateToError] = useState(false);

  useEffect(() => {
    async function fetchEmployeeInfo() {
      setLoader(true);
      try {
        const empId = jwtDecode<JwtPayload>(localStorage.getItem("userToken")||"").sub;
        const res = await axiosInstance.get(`/employee/${empId}`);
        setCurrEmp(res.data);
      } catch (error: any) {
        console.error((error.message as string),(error.message as string).includes("Invalid token specified:"));
        if ((error.message as string).includes("Invalid token specified:")) {
          setNavigateToError(true);
        }
        setErrorPresent(error.message);
      } finally {
        setLoader(false);
      }
    }
    fetchEmployeeInfo();
  }, []);

  const handleNavigateEmployee = () => setNavigateToEmp(true);
  const handleProjectAllocation = () => setNavigateToAdminProject(true);
  const handleEmpAppraisal = () => setNavigateToAdminAppraisal(true);
  const handleApprove = () => setEmpApproval(true);

  if (!localStorage.getItem("userToken")) {
    return <Navigate to="/" />;
  }

  if (navigateToEmp) return <Navigate to="/user" />;
  if (navigateToAdminProject) return <Navigate to="/admin/project" />;
  if (navigateToAdminAppraisal) return <Navigate to="/admin" />;
  if (empApproval) return <Navigate to="/admin/approval" />;
  if (navigateToError) {
    return <Navigate to="*" replace={false} />;
  }
  return (
    <>
      <NavbarComponent></NavbarComponent>
      {loader && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 mt-5">
          <EmployeeCardSkeleton />
        </div>
      )}
      {!loader && currEmp && (
        <section className="container-fluid bg-dark-subtle min-vh-100 py-5 mt-5">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div className="card text-center h-100">
                  <div className="card-body">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                      alt="avatar"
                      className="rounded-circle img-fluid mb-3"
                      style={{ width: "150px" }}
                    />
                    <h5 className="card-title mb-2">
                      {currEmp.firstName} {currEmp.lastName}
                    </h5>
                    <p className="card-text text-muted mb-4">
                      {currEmp.role === "empl" ? "Employee" : "Admin"}
                    </p>
                    <p className="card-text mb-4">EmpId: {currEmp.empId}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <div className="card mb-4 h-100 shadow-sm border-light">
                  <div className="card-body">
                    <h5 className="card-title mb-4">Details</h5>
                    <ul className="list-unstyled">
                      <li className="d-flex justify-content-between mb-3">
                        <strong className="text-muted">Full Name:</strong>
                        <span>
                          {currEmp.firstName} {currEmp.lastName}
                        </span>
                      </li>
                      <li className="d-flex justify-content-between mb-3">
                        <strong className="text-muted">Email:</strong>
                        <span>{currEmp.email}</span>
                      </li>
                      <li className="d-flex justify-content-between mb-3">
                        <strong className="text-muted">Phone:</strong>
                        <span>{currEmp.contactNumber}</span>
                      </li>
                      <li className="d-flex justify-content-between mb-3">
                        <strong className="text-muted">Designation:</strong>
                        <span>{currEmp.designationTitle}</span>
                      </li>
                      <li className="d-flex justify-content-between mb-3">
                        <strong className="text-muted">Date of Join:</strong>
                        <span>{currEmp.doj.slice(0, 10)}</span>
                      </li>
                      <li className="row">
                        {currEmp.role === "empl" && (
                          <div className="col-12 col-md-6 col-lg-3 mb-2">
                            <button
                              className="btn btn-primary w-100"
                              onClick={handleNavigateEmployee}
                            >
                              View Tasks
                            </button>
                          </div>
                        )}
                        {currEmp.role === "ADMIN" && (
                          <div className="col-12 col-md-6 col-lg-5 mb-2">
                            <button
                              className="btn btn-primary w-100"
                              onClick={handleProjectAllocation}
                            >
                              Project Allocation
                            </button>
                          </div>
                        )}
                        {currEmp.role === "ADMIN" && (
                          <div className="col-12 col-md-6 col-lg-3 mb-2">
                            <button
                              className="btn btn-primary w-100"
                              onClick={handleEmpAppraisal}
                            >
                              Appraisal
                            </button>
                          </div>
                        )}
                        {currEmp.role === "ADMIN" && (
                          <div className="col-12 col-md-6 col-lg-3 mb-2">
                            <button
                              className="btn btn-primary w-100"
                              onClick={handleApprove}
                            >
                              Approval
                            </button>
                          </div>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {errorPresent && (
        <ToastComponent
          closeMessage={() => setErrorPresent("")}
          errorPresent={errorPresent}
        />
      )}
    </>
  );
};

export default LandingPage;
