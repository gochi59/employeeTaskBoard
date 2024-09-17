import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import EmployeeDashBoard from './Components/EmployeeDashBoard';
import 'font-awesome/css/font-awesome.min.css';
import AdminDashboard from './Components/AdminDashboard';
import Signup from './Components/Signup';
import AdminApprovalDashboard from './Components/AdminApprovalDashboard';
import AdminProjectAllocation from './Components/AdminProjectAllocation';


const router=createBrowserRouter([
  {
    path:"/",
    element:<LoginPage></LoginPage>,
  },
  {
    path:"/user",
    element:<EmployeeDashBoard/>
  },
  {
    path:"/admin",
    element:<AdminDashboard/>
  },
  {
    path:"/signup",
    element:<Signup/>
  },
  {
    path:"/admin/approval",
    element:<AdminApprovalDashboard/>
  },
  {
    path:"/admin/project",
    element:<AdminProjectAllocation/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
