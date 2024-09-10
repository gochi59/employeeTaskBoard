import axios from "axios";
import { FieldValues, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledText = styled.p`
  font-family: "Monsterrat", sans-serif;
`;

const LoginPage = () => {
    const {register,handleSubmit,formState:{errors}}=useForm();
    const formSubmit=async (data:FieldValues)=>{
        const user={
            email:data.email,
            password:data.password
        };
        try {
            const jwtToken=await axios.post("http://localhost:8080/login",user);
            localStorage.setItem("userToken",jwtToken.data);
            
        } catch (error:any) {
            if(error.response.status===401)
            {
                alert("Invalid Username or password");
            }
        }

        
    };
  return (
    <div className="row vh-100">
      <div className="col-md-6 bg-dark text-bg-dark h-100 justify-content-center align-content-center h-auto">
        <StyledText>
          <p className="h1 text-center">
            Beesheet
            <br />
            Login and Signup
          </p>
        </StyledText>
      </div>
      <div className="col-md-6 bg-dark-subtle align-content-center col-12">
        <form className="p-3" method="post" onSubmit={handleSubmit(formSubmit)}>
            <label htmlFor="email" className="form-label text-body-emphasis h6">Email:</label>
            <input {...register('email')} type="email" name="email" id="email" className="form-control mb-2"/>
            <label htmlFor="passoword" className="form-label text-body-emphasis h6">Password:</label>
            <input {...register('password')} type="password" name="password" id="password" className="form-control mb-3"/>
            <button type="submit" className="btn btn-dark me-2">Submit</button>
            <Link to="/signup"><button className="btn btn-dark">Signup</button></Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
