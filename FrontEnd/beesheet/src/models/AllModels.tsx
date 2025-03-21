import styled from "styled-components";

//All existing interfaces defined here and exported

export interface Designation {
  attributes: string[];
  id: number;
  title: string;
}

export const StyledText = styled.span`
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

export interface  Task {
  date: Date;
  description: string;
  markedForAppraisal: boolean;
  project: string;
  taskId: number;
  taskRating: string;
  time: string;
  title: string;
  workLocation: string; 
}

export interface taskInput{
    title:string;
    markedForAppraisal:boolean;
    workLocation:string; 
    project:string;
    time:string;
    description:string;
    date:Date;
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
  empTask:Task[];
  apprasailDone:boolean;
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

export interface AttributeRating{
  attribute:string;
  rating:string;
}

export interface ReduxState{
  header:{},
  ID:string,
  employeeTaskAndAttributeList:ReduxEmpList[],
}

export interface Notifications{
  message:string;
  empDto:Employee;
  empId:number;
  id:number;
}

export interface ReduxEmpList{
  emp:number;
  taskList:Task[];
  attributeList:AttributeRating[];
}