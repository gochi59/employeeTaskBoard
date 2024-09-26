import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { ReduxEmpList } from "../models/AllModels";

const initialState = {
  header:
    {
      headers: { Authorization: "Bearer " + localStorage.getItem("userToken") },
    } || {},
  ID: "",
  employeeTaskAndAttributeList: [
    {
      emp: 0,
      taskList: [],
      attributeList: [],
    },
  ],
};

export const Slice = createSlice({
  name: "JwtSlice",
  initialState,
  reducers: {
    changeToken: (state) => {
      // const jwt = localStorage.getItem("userToken") || "";
      // const { sub } = jwtDecode<JwtPayload>(jwt);
      // const config = {
      //   headers: { Authorization: "Bearer " + jwt },
      // };
      // state.header = config;
      // state.ID = sub || "";
      // //   console.log(state.header,state.ID);
    },
    clearToken: (state) => {
      state.header = {
        headers: { Authorization: "" },
      };
      state.ID = "";
    },
    setEmployeeTaskAttributeList: (state, action) => {
      const currEmp = action.payload.emp;
      const taskList = action.payload.taskList;
      const attributeList = action.payload.attributeList;

      const existingEmpIndex = state.employeeTaskAndAttributeList.findIndex(
        (obj: ReduxEmpList) => obj.emp === currEmp
      );

      if (existingEmpIndex !== -1) {
        state.employeeTaskAndAttributeList[existingEmpIndex] = {
          emp: currEmp,
          taskList: [...taskList],
          attributeList: [...attributeList],
        };
      } else {
        state.employeeTaskAndAttributeList = [
          ...state.employeeTaskAndAttributeList,
          { emp: currEmp, taskList: taskList, attributeList: attributeList },
        ];
      }
    },
  },
});

export const { changeToken, clearToken, setEmployeeTaskAttributeList } =
  Slice.actions;
export default Slice.reducer;
