import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Designation } from "../models/AllModels";

const Signup = () => {
  const [designationList, setDesignationList] = useState<Designation[]>();
  useEffect(() => {
    async function getAllDesignation() {
      try {
        const res = await axios.get("http://localhost:8080/alldes");
        setDesignationList(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllDesignation();
  },[]);
  console.log(designationList);
  const {register,handleSubmit,formState:{errors}}=useForm();
  return (
    
    <div className="bg-dark-subtle">
      <p className="h1 text-center">Signup</p>
      <div className="container">
        <form method="post" className="py-auto">
          <label htmlFor="firstname" className="form-label">
            Firstname:{" "}
          </label>
          <input {...register('firstname')}
            type="text"
            name="firstname"
            id="firstname"
            className="form-control mb-2"
          />
          <label htmlFor="lastname" className="form-label">
            Lastname:{" "}
          </label>
          <input
            type="text" {...register("lastname")}
            name="lastname"
            id="lastname"
            className="form-control mb-2"
          />
          <label htmlFor="email" className="form-label">
            Email:{" "}
          </label>
          <input 
            type="text" {...register("email")}
            name="email"
            id="email"
            className="form-control mb-2"
          />
          <label htmlFor="role" className="form-label">
            Role:
          </label>
          <select id="role" className="form-select" {...register("role")}>
            <option value="ADMIN">Admin</option>
            <option value="empl">Employee</option>
          </select>
          <br />
          <label htmlFor="doj" className="form-label">
            Date of Joining:
          </label><br />
          <input type="date" id="doj" className="form-control" {...register("doj")}/>
          <br />
          <label htmlFor="designation" className="form-label ">
            Designation:
          </label><br />
          <select {...register("designation")} id="designation" className="form-select">
            {designationList &&
              designationList.map((des) => <option value={des.title} key={des.id}>{des.title}</option>)}
          </select>
          <br />
          <label htmlFor="number" className="form-label">
            Contact Number:
          </label>
          <input
            type="text" {...register("number")}
            name="number"
            id="number"
            className="form-control"
          />
        </form>
      </div>
    </div>
  );
};

export default Signup;
 