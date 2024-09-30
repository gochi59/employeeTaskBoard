import React from "react";

const TaskAttributeRatingSkeleton = () => {
  const renderSkeletonRows = (columns: number, rows: number) => (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex}>
              <div className="placeholder-glow">
                <span className="placeholder col-12"></span>
              </div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );

  // console.log("skeleton called");
  return (
      <div
        className="modal show d-block"
        tabIndex={-1}
        role="dialog"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content d-flex flex-column" style={{ height: "80vh" }}>
            <div className="modal-header">
              <h5 className="modal-title">Employee Tasks</h5>
            </div>
            <div className="modal-body overflow-auto" style={{ maxHeight: "60vh" }}>
              <table className="table table-hover table-success">
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Project</th>
                    <th scope="col" className="d-none d-sm-table-cell">Work Location</th>
                    <th scope="col" className="d-none d-sm-table-cell">Descriptions</th>
                    <th scope="col">Add/Change Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {renderSkeletonRows(5, 5)} {/* 5 rows */}
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
                  {renderSkeletonRows(2, 5)} {/* 5 rows for attributes */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
};

export default TaskAttributeRatingSkeleton;
