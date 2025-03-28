import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { AttributeRating, Employee, Task } from "../models/AllModels";
import { useDispatch } from "react-redux";
import { setEmployeeTaskAttributeList } from "../redux/HeaderSlice";
import { Navigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";

interface props {
  closeModal: () => void;
  currEmpTaskList: Task[];
  currEmpId: Employee;
  currAttributeList:AttributeRating[];
}

//Table showing all tasks and the employee's attribute with a select drop down besides with rating to give from 1 to 5 sending data as a string

const TaskAttributeRating = ({
  closeModal,
  currEmpTaskList,
  currEmpId,
  currAttributeList,
}: props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch=useDispatch();
  const ratingSubmit = async (data: FieldValues) => {
    setLoading(true);
    try {
        for (const task of currEmpTaskList) {
            const str = task.taskId;
            const updatedTask = { ...task, taskRating: data[str] };
            currEmpTaskList = currEmpTaskList.map((task: Task) => task.taskId === str ? { ...task, taskRating: data[str] } : task);
            await axiosInstance.put(
                `/admin/task/${str}`,
                updatedTask
            );
        }

        for (const attribute of currAttributeList) {
            const attributeTitle = attribute.attribute;
            const updatedAttribute = { ...attribute, rating: data[attributeTitle] };
            currAttributeList = currAttributeList.map((attribute: AttributeRating) => attribute.attribute === attributeTitle ? { ...attribute, rating: data[attributeTitle] } : attribute);
            await axiosInstance.put(
                `/admin/employee/attribute/${currEmpId.empId}`,
                updatedAttribute
            );
        }
        dispatch(setEmployeeTaskAttributeList({ emp: currEmpId.empId, taskList: currEmpTaskList, attributeList: currAttributeList }));
        await axiosInstance.post(`/admin/employee/notification/${currEmpId.empId}`);
        closeModal();
        currEmpId.apprasailDone = true;
    } catch (error: any) {
        console.log(error);
        // if (error.response.data === "JWT token is expired." || error.response.data === "Invalid JWT token.") {
        //     dispatch(clearToken());
        //     localStorage.removeItem("userToken");
        // }
    } finally {
        setLoading(false);
    }
};


  const { register, handleSubmit } = useForm();

  if (!localStorage.getItem("userToken")) {
    return <Navigate to="/"></Navigate>;
  }
  return (
    <div>
      <div
        className="modal show d-block"
        tabIndex={-1}
        role="dialog"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div
            className="modal-content d-flex flex-column"
            style={{ height: "80vh" }}
          >
            <div className="modal-header">
              <h5 className="modal-title">Employee Tasks</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>
            <form
              onSubmit={handleSubmit(ratingSubmit)}
              className="flex-grow-1 d-flex flex-column"
            >
              <div
                className="modal-body overflow-auto"
                style={{ maxHeight: "60vh" }}
              >
                {currEmpTaskList && (
                  <>
                    <table className="table table-hover table-success">
                      <thead>
                        <tr>
                          <th scope="col">Title</th>
                          <th scope="col">Project</th>
                          <th scope="col" className="d-none d-sm-table-cell">
                            Work Location
                          </th>
                          <th scope="col" className="d-none d-sm-table-cell">
                            Descriptions
                          </th>
                          <th scope="col">Add/Change Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currEmpTaskList
                          .filter((task: Task) => task.markedForAppraisal)
                          .map((task: Task) => (
                            <tr key={task.taskId}>
                              <td>{task.title}</td>
                              <td>{task.project}</td>
                              <td className="d-none d-sm-table-cell">
                                {task.workLocation}
                              </td>
                              <td className="d-none d-sm-table-cell">
                                {task.description}
                              </td>
                              <td>
                                <select
                                  {...register("" + task.taskId)}
                                  className="form-select m-sm-1"
                                  required
                                  defaultValue={task.taskRating || ""}
                                >
                                  <option value=""></option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>

                    <table className="table table-hover table-success">
                      <thead>
                        <tr>
                          <th scope="col">Attribute</th>
                          <th scope="col">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currAttributeList.map(
                          (attribute: AttributeRating) => (
                            <tr key={attribute.attribute}>
                              <td>{attribute.attribute}</td>
                              <td>
                                <select
                                  {...register("" + attribute.attribute)}
                                  className="form-select m-1"
                                  required
                                  defaultValue={attribute.rating || ""}
                                >
                                  <option value=""></option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5</option>
                                </select>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button
                  type="submit"
                  className="btn btn-success m-1"
                  disabled={loading}
                >
                  {loading && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  <span> Submit Rating</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={loading}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAttributeRating;
