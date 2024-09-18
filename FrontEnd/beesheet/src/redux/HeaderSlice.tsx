import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode, JwtPayload } from "jwt-decode";

const initialState = {
  header: {
    headers:{Authorization:"Bearer "+localStorage.getItem("userToken"),}
  }||{},
  ID: localStorage.getItem("userToken")?jwtDecode<JwtPayload>(localStorage.getItem("userToken")||"").sub:"",
};

export const Slice = createSlice({
  name: "JwtSlice",
  initialState,
  reducers: {
    changeToken: (state) => {
      const jwt = localStorage.getItem("userToken") || "";
      const { sub } = jwtDecode<JwtPayload>(jwt);
      const config = {
        headers: { Authorization: "Bearer " + jwt },
      };
      state.header=config;
      state.ID = sub || "";
    //   console.log(state.header,state.ID);
      
    },
    clearToken:(state)=>{
      state.header={
        headers:{Authorization:""}
      };
      state.ID=""

    }
  },
});

export const { changeToken,clearToken } = Slice.actions;
export default Slice.reducer;
