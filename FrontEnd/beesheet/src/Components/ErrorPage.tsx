import { Link } from "react-router-dom";
import { StyledText } from "../models/AllModels";
import { useDispatch } from "react-redux";
import { clearToken } from "../redux/HeaderSlice";

const ErrorPage = () => {

    const dispatch=useDispatch();
    const logout=()=>{
        dispatch(clearToken());
        localStorage.removeItem("userToken");
    }
  return (
    <div className="container-fluid">
      <div className="row vh-100 vw-100">
        <div className="col-md-6 bg-dark text-bg-dark justify-content-center align-content-center h-auto">
          <StyledText>
            <p className="h1 text-center">
              Beesheet
              <br />
            </p>
          </StyledText>
        </div>
        <div className="col-md-6 bg-dark-subtle align-content-center col-12 me-0">
          <div className="p-3 me-0 text-center">
            <h2 className="mb-3 text-body-emphasis">Oops! This page doesn't exist.</h2>
            <p className="h6 mb-3 text-body-emphasis">
              The page you are looking for might have been removed or is temporarily unavailable.
            </p>
            <Link to="/">
              <button className="btn btn-dark" onClick={logout}>Go Back to Home</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
