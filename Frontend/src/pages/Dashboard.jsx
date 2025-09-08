import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'


const Dashboard = () => {

  const [userData, setUserData] = useState('')

  useEffect( () => {
    
    const fetchData = async () =>{
      try{

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
          withCredentials: true
        });

        setUserData(response.data.user);
      }catch(error){
        console.log(error);
      }
    }
    fetchData();
  }, [])





  return (
    <div className='flex flex-col justify-center items-center h-screen w-full'>
      <h1>Dashboard</h1>
      <div className='bg-amber-100 text-center h-[30vh] w-[40vw] my-20'>
        <h2>{userData.name}</h2>
        <h3>{userData.email}</h3>

        <button className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 hover:cursor-pointer'>
            Logout
        </button>
      </div>
    </div>
  )
}

export default Dashboard
