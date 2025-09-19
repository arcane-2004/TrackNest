import React from 'react'
import Sidebar from '../components/Sidebar'


const Dashboard = () => {
  return (

    <div className="h-full w-full bg-[radial-gradient(_#867BB8,#000000)] text-white flex">
      <div className="h-full w-full absolute bg-[#202020] opacity-55 backdrop-blur-lg"></div>
      <div>
        <Sidebar />
      </div>

    </div>





  )
}

export default Dashboard
