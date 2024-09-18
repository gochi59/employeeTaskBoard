import React from 'react'
import { Navbar } from 'react-bootstrap'
import AdminDashboard from './AdminDashboard'
import AdminProjectAllocation from './AdminProjectAllocation'
import AdminApprovalDashboard from './AdminApprovalDashboard'
import { useSelector } from 'react-redux'
import { ReduxState } from '../models/AllModels'
import NavbarComponent from './NavbarComponent'

const AdminMainPage = () => {
    const loginId=useSelector((state:ReduxState)=>state.ID);
    const headerConfig=useSelector((state:ReduxState)=>state.header);
  return (
    <div>
      <div className=''>
      <NavbarComponent empId={loginId} config={headerConfig} />

      <div className="container-fluid pt-3 mt-5 bg-dark-subtle min-vh-100">
        <h2>Admin Dashboard</h2>

        <div className="accordion row-cols-auto" id="adminAccordion">
          
          <div className="accordion-item col">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button collapsed h6" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                Employee Task Management
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#adminAccordion">
              <div className="accordion-body">
                <div >
                  <AdminDashboard/>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item col">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button collapsed h5" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Project Allocation
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#adminAccordion">
              <div className="accordion-body">
                <div >
                  <AdminProjectAllocation></AdminProjectAllocation>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item col">
            <h2 className="accordion-header" id="headingThree">
              <button className="accordion-button collapsed h5" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                Admin Approval Dashboard
              </button>
            </h2>
            <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#adminAccordion">
              <div className="accordion-body">
                <AdminApprovalDashboard></AdminApprovalDashboard>
              </div>
            </div>
          </div>
        </div>
      </div>

     </div>
    </div>
  )
}

export default AdminMainPage
