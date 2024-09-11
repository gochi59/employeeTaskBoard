import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { jwtDecode, JwtPayload } from 'jwt-decode';
import axios from 'axios';

const EmployeeDashBoard = () => {
    const [taskList,setTaskList]=useState([]);
    useEffect(()=>{
        const jwtToken=String(localStorage.getItem("userToken"));
        const {sub}=jwtDecode<JwtPayload>(jwtToken);
        const config={
            headers:{'Authorization':"Bearer "+jwtToken}
        }
        // console.log(config);
        async function getTaskList() {
            try {       
                const res=await axios.get("http://localhost:8080/tasks/"+sub,config);
                // console.log(res);
                setTaskList(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        getTaskList();
        
    },[])
    console.log(taskList);
  return (
    <div>
       <Navbar></Navbar>
       <div className="">

       </div>
    </div>
  )
}

export default EmployeeDashBoard
