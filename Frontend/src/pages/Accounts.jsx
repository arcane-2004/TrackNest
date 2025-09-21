import React from 'react'
import Sidebar from '../components/Sidebar'
import { LogOut, Plus } from 'lucide-react';
import { useHandleLogout } from '../utils/user.hooks'
import CreateAccount from '../components/CreateAccount';


const Accounts = () => {

    const handleLogout = useHandleLogout();

    return (
        <div className='h-full w-full bg-[#111010] text-white flex'>
            <div>
                <Sidebar />
            </div>
            <div className='p-3 h-full w-full'>
                <div className='relative w-full h-10 mb-8 flex items-center p-5'>
                    <h2 className='absolute text-2xl font-bold right-20'>Accounts</h2>
                    <span className='absolute right-5 text-[#ae5921] hover:cursor-pointer'
                        onClick={handleLogout}
                    ><LogOut /></span>
                </div>

                {/* card area */}
                <div className='p-10'>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        <CreateAccount>
                            <div className=" h-[25vh] p-4 rounded-2xl text-white flex flex-col items-center justify-center 
                        bg-[rgba(68,81,98,0.28)] hover:cursor-pointer ">
                                <div className='text-lg font-bold text-orange-600'>
                                    <Plus />
                                </div>
                                <p className='text-lg font-figtree font-medium '>Add new account</p>
                            </div>
                        </CreateAccount>

                        
                        <div className="bg-white p-4 rounded-xl shadow">Card 2</div>
                        <div className="bg-white p-4 rounded-xl shadow">Card 3</div>
                        <div className="bg-white p-4 rounded-xl shadow">Card 4</div>
                        <div className="bg-white p-4 rounded-xl shadow">Card 5</div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Accounts
