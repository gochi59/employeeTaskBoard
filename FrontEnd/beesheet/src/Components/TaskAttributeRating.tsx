import React from 'react'
import { FieldValues, useForm } from 'react-hook-form';
import { AttributeRating, Task } from '../models/AllModels';

interface props {
  closeModal: (() => void),
  ratingSubmit: (data: FieldValues) => void,
  currEmpTaskList: Task[],
  empAttributeRating: AttributeRating[],
}

const TaskAttributeRating = ({ closeModal, ratingSubmit, currEmpTaskList, empAttributeRating }: props) => {
  const { register, handleSubmit, reset } = useForm();
  return (
    <div>
      <div
        className="modal show d-block"
        tabIndex={-1}
        role="dialog"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Employee Tasks</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>
            <form onSubmit={handleSubmit(ratingSubmit)}>
              <div className="modal-body">
                {currEmpTaskList && (
                  <>
                    <table className="table table-hover table-success ">
                      <thead>
                        <tr>
                          <th scope="col">Title</th>
                          <th scope="col">Project</th>
                          <th scope="col" className='d-none d-sm-table-cell'>Work Location</th>
                          <th scope="col" className='d-none d-sm-table-cell'>Descriptions</th>
                          <th scope="col" >Add/Change Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currEmpTaskList
                          .filter((task: Task) => task.markedForAppraisal)
                          .map((task: Task) => (
                            <tr key={task.taskId}>
                              <td>{task.title}</td>
                              <td>{task.project}</td>
                              <td className='d-none d-sm-table-cell'>{task.workLocation}</td>
                              <td className='d-none d-sm-table-cell'>{task.description}</td>
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
                        {empAttributeRating.map(
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
                <button type="submit" className="btn btn-success m-1">
                  Submit Rating
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskAttributeRating;
