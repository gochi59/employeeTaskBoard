import styled from "styled-components";

export interface Designation {
  attributes: string[];
  id: number;
  title: string;
}

export const StyledText = styled.p`
  font-family: "Monsterrat", sans-serif;
`;

export interface FormDataForSignup {
  firstname: string;
  lastname: string;
  password: string;
  role: "empl" | "ADMIN";
  designation: string;
  number: string;
  doj: string;
  email: string;
}

export interface Task {
  date: string;
  description: string;
  markedForAppraisal: boolean;
  project: string;
  taskId: number;
  taskRating: string;
  time: string;
  title: string;
  workLocation: "office" | "home"; // Change this to a union of string literals
}

export interface taskInput{
    title:string;
    markedForAppraisal:boolean;
    workLocation:"office" | "home"; 
    project:string;
    time:string;
    description:string;
    date:string;
}

export interface Employee{
  email: string;
  contactNumber: string;
  empId:number;
  firstName:string;
  lastName:string;
  designationTitle:string;
  role:string;
  doj:string;
  projectTitles:string[];

}
export interface TemporaryEmployee{
  email: string;
  contactNumber: string;
  tempId:number;
  firstName:string;
  lastName:string;
  designation:string;
  role:string;
  dateOfJoin:string;
  projectTitles:string[];

}

export interface Project{
  id:number;
  name:string;
  emp:Employee[];
}