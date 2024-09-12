import styled from "styled-components";

export interface Designation {
  attributes: string[];
  empList: string[];
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
  workLocation: ["office","home"];
}

export interface taskInput{
    title:string;
    markedForAppraisal:boolean;
    workLocation:["office","home"];
    project:string;
    time:string;
    description:string;
    date:string;
}