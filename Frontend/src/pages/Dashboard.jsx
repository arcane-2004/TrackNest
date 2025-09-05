import React from 'react'

const Dashboard = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen w-full'>
      <h1>Dashboard</h1>
      <div className='bg-amber-100 text-center h-[30vh] w-[40vw] my-20'>
        <h2>Name</h2>
        <h3>Email</h3>

        <button className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 hover:cursor-pointer'>
            Logout
        </button>
      </div>
    </div>
  )
}

export default Dashboard
