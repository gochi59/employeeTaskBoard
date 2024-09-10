import { Link } from "react-router-dom"


const Navbar = () => {
  return (
    <div className='navbar bg-dark text-bg-dark p-1'>
    <div className="navbar-brand text-light nav-link"><Link to="https://www.beehyv.com/" className="text-decoration-none text-bg-dark">BeeHyv</Link></div>
    <div className="">
    <i className="fa fa-regular fa-bell btn btn-dark"></i>
    <button className="btn btn-dark">Logout</button>
    </div>
    </div>
  )
}

export default Navbar
