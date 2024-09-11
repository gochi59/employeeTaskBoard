import axios from "axios";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import {
  Designation,
  FormDataForSignup,
  StyledText,
} from "../models/AllModels";
import { z, ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported
import "bootstrap/dist/js/bootstrap.bundle.min"; // Ensure Bootstrap JS is imported

const Signup = () => {
  const [designationList, setDesignationList] = useState<Designation[]>([]);
  const [errorPresent, setErrorPresent] = useState<string | null>(null);
  const [schema, setSchema] = useState<ZodSchema<any>>(z.object({}));

  useEffect(() => {
    const designationTitles =
      designationList.map((des: Designation) => des.title) || [];

    const updatedSchema = z.object({
      firstname: z.string().min(1, { message: "Invalid firstname" }),
      lastname: z.string(),
      password: z.string().min(1, { message: "Invalid password" }),
      role: z.enum(["empl", "ADMIN"], { message: "Select a role" }),
      designation: z.enum(designationTitles as [string, ...string[]], {
        message: "Select a designation",
      }),
      number: z.string().min(1, { message: "Enter valid Contact Number" }),
      doj: z.string().min(1, { message: "Select a date" }),
      email: z
        .string()
        .min(1, { message: "This field has to be filled" })
        .email({ message: "Invalid Email" }),
    });
    setSchema(updatedSchema);
  }, [designationList]);

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
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataForSignup>({ resolver: zodResolver(schema) });

  const formSubmit = async (data: FieldValues) => {
    const employee = {
      firstName: data.firstname,
      lastName: data.lastname,
      email: data.email,
      dateOfJoin: data.doj,
      contactNumber: data.number,
      designation: data.designation,
      role: data.role,
      password: data.password,
    };
    try {
      const res = await axios.post("http://localhost:8080/signup", employee);
      console.log(res);
      setErrorPresent("Submitted Succesfully \n Wait for Approval ")
    } catch (error: any) {
      setErrorPresent(JSON.stringify(error.response.data));
    }
  };

  const handleToastClose = () => {
    setErrorPresent(null);
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <div className="col-md-6 h-auto bg-dark text-bg-dark justify-content-center align-content-center">
          <StyledText>
            <p className="h1 text-center">
              Beesheet
              <br />
              Employee Registration
            </p>
          </StyledText>
        </div>
        <div className="col-md-6 col-12 h-auto bg-dark-subtle align-content-center">
          <form
            method="post"
            className="mt-2"
            onSubmit={handleSubmit(formSubmit)}
          >
            <label htmlFor="firstname" className="form-label h6">
              Firstname:
            </label>
            <input
              {...register("firstname")}
              type="text"
              name="firstname"
              id="firstname"
              className="form-control mb-2"
            />
            {errors.firstname && (
              <p className="text-danger">{errors.firstname.message}</p>
            )}
            <label htmlFor="lastname" className="form-label h6">
              Lastname:
            </label>
            <input
              type="text"
              {...register("lastname")}
              name="lastname"
              id="lastname"
              className="form-control mb-2"
            />
            {errors.lastname && (
              <p className="text-danger">{errors.lastname.message}</p>
            )}
            <label htmlFor="email" className="form-label h6">
              Email:
            </label>
            <input
              type="text"
              {...register("email")}
              name="email"
              id="email"
              className="form-control mb-2"
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
            <label htmlFor="password" className="form-label h6">
              Password:
            </label>
            <input
              type="text"
              {...register("password")}
              name="password"
              id="password"
              className="form-control mb-2"
            />
            {errors.password && (
              <p className="text-danger">{errors.password.message}</p>
            )}
            <label htmlFor="role" className="form-label h6">
              Role:
            </label>
            <select id="role" className="form-select" {...register("role")}>
              <option value=""></option>
              <option value="ADMIN">Admin</option>
              <option value="empl">Employee</option>
            </select>
            {errors.role && (
              <p className="text-danger">{errors.role.message}</p>
            )}
            <br />
            <label htmlFor="doj" className="form-label h6">
              Date of Joining:
            </label>
            <input
              type="date"
              id="doj"
              className="form-control"
              {...register("doj")}
            />
            {errors.doj && <p className="text-danger">{errors.doj.message}</p>}
            <br />
            <label htmlFor="designation" className="form-label h6">
              Designation:
            </label>
            <select
              {...register("designation")}
              id="designation"
              className="form-select"
            >
              <option value=""></option>
              {designationList.map((des) => (
                <option value={des.title} key={des.id}>
                  {des.title}
                </option>
              ))}
            </select>
            {errors.designation && (
              <p className="text-danger">{errors.designation.message}</p>
            )}
            <br />
            <label htmlFor="number" className="form-label h6">
              Contact Number:
            </label>
            <input
              type="text"
              {...register("number")}
              name="number"
              id="number"
              className="form-control"
            />
            {errors.number && (
              <p className="text-danger">{errors.number.message}</p>
            )}
            <button type="submit" className="btn btn-dark my-3">
              Submit
            </button>
          </form>
          {errorPresent && (
            <div
              className="toast show position-fixed bottom-0 end-0 m-3"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              <div className="toast-header">
                <strong className="me-auto">Message</strong>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleToastClose}
                  aria-label="Close"
                ></button>
              </div>
              <div className="toast-body">{errorPresent}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
