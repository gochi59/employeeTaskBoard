import axios from "axios";
import { FieldValues, useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import styled from "styled-components";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

const StyledText = styled.p`
  font-family: "Monsterrat", sans-serif;
`;

const LoginPage = () => {
  const [navigate,setNavigate]=useState(false);
  const schema = z.object({
    email: z
      .string()
      .min(1, { message: "This field has to be filled" })
      .email({message:"Invalid Email"}),
    password: z.string().min(1, { message: "This field has to be filled" }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const formSubmit = async (data: FieldValues) => {
    const user = {
      email: data.email,
      password: data.password,
    };
    try {
      const jwtToken = await axios.post("http://localhost:8080/login", user);
      localStorage.setItem("userToken", jwtToken.data);
      setNavigate(true);
    } catch (error: any) {
      if (error.response.status === 401) {
        alert("Invalid Username or password");
      }
    }
  };
  if(navigate)
  {
    const jwtToken=(String(localStorage.getItem("userToken")));
    const {Role}=jwtDecode<JwtPayload>(jwtToken);
    if(Role==="empl")
        return <Navigate to="/user" replace={true}></Navigate>
    else if(Role==="ADMIN")
        return <Navigate to="/admin" replace={true}></Navigate>
  }
  return (
    <div className="container-fluid">
    <div className="row vh-100 vw-100">
      <div className="col-md-6 bg-dark text-bg-dark justify-content-center align-content-center h-auto">
        <StyledText>
          <p className="h1 text-center">
            Beesheet
            <br />
            Login and Signup
          </p>
        </StyledText>
      </div>
      <div className="col-md-6 bg-dark-subtle align-content-center col-12 me-0">
        <form className="p-3 me-0" method="post" onSubmit={handleSubmit(formSubmit)}>
          <label htmlFor="email" className="form-label text-body-emphasis h6">
            Email:
          </label>
          <input
            {...register("email")}
            type="email"
            name="email"
            id="email"
            className="form-control mb-2"
            
          />
          {errors.email && (
            <p className="text-danger">{String(errors.email.message)}</p>
          )}

          <label
            htmlFor="passoword"
            className="form-label text-body-emphasis h6"
          >
            Password:
          </label>
          <input
            {...register("password")}
            type="password"
            name="password"
            id="password"
            className="form-control mb-3"
          />
          {errors.password && (
            <p className="text-danger">{String(errors.password.message)}</p>
          )}

          <button type="submit" className="btn btn-dark me-2">
            Submit
          </button>
          <Link to="/signup">
            <button className="btn btn-dark">Signup</button>
          </Link>
        </form>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
