import React from 'react'
import Sidebar from '../components/Sidebar'
import {LogOut} from 'lucide-react';
import {useHandleLogout} from '../utils/user.hooks'


const Transactions = () => {

    const handleLogout = useHandleLogout();

  return (
    <div className='h-full w-full bg-[#111010] text-white flex'>
      <div>
        <Sidebar/>
      </div>
      <div className='p-3 h-full w-full'>
        <div className='relative w-full h-10 mb-8 flex items-center p-5'>
          <h2 className='absolute text-2xl font-bold right-20'>Dashboard</h2>
          <span className='absolute right-5 text-[#ae5921] hover:cursor-pointer'
          onClick={handleLogout}
          ><LogOut/></span>
        </div>


      </div>
    </div>
  )
}

export default Transactions
