import React  from 'react'
import Sidebar from '../components/Sidebar'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react';
import {useHandleLogout} from '../utils/user.hooks';

const Dashboard = () => {

  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  const handleLogout = useHandleLogout();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/transaction/get-transactions`,
          { withCredentials: true }
        );
        setTransactions(response.data.transactions);
        console.log(response.data)// assuming backend sends an array
      } catch (err) {
        console.error(err.response?.data?.message || "Something went wrong");
      }
    };

    fetchTransactions();
  }, []);


  return (

    <div className="h-full w-full bg-[#111010] text-white flex">
      <div>
        <Sidebar />
      </div>
      <div className='p-3 h-full w-full'>
        <div className='relative w-full h-10 mb-8 flex items-center p-5'>
          <h2 className='absolute text-2xl font-bold right-20'>Dashboard</h2>
          <span className='absolute right-5 text-[#ae5921] hover:cursor-pointer'
          onClick={handleLogout}
          ><LogOut/></span>
        </div>

        <div className='h-[92%] ml-3 flex gap-2'>
          <div className='w-3/5 '>

            <div className='h-1/2 flex gap-2'>

              <div className='w-4/7 border-2 border-white'>
              </div>

              <div className='w-3/7 '>
                <div className='h-1/2 flex items-center justify-center rounded-4xl mb-4 border border-[#6d6d6d] bg-[rgba(68,81,98,0.12)] text-white'>
                  INCOME
                </div>
                <div className='h-1/2 rounded-4xl border border-[#6d6d6d]  bg-[rgba(68,81,98,0.12)]  backdrop-blur-md shadow-md text-center text-white'>

                </div>
              </div>
            </div>

            <div className='h-1/2 '>

            </div>
          </div>


          <div className='w-2/5 '>
            <div className='relative h-2/5 border-1 border-[#6d6d6d] bg-gradient-to-b from-black/20 to-white/10 rounded-4xl backdrop-blur-2xl shadow-md 
          '>

              <h2 className='ml-10 mt-4'>Profile</h2>

              <div className='flex flex-col items-center justify-center text-white'>
                <div className='rounded-full h-30 w-30 bg-white '>

                </div>
                <span className='text-2xl font-bold mb-4'>Sumit</span>
                <span className='mt-5 text-xs font-medium'>Total Balance</span>
                <span className='text-4xl font-bold'>200000</span>
              </div>


            </div>



            <div className='h-3/5 p-8'>
              <div className='flex justify-between items-center'>
                <h3 className='font-figtree font-semibold text-lg text-[#C96E36] my-4'>Recent Transactions</h3>
                <span className='text-sm font-semibold text-[#F0BC98] hover:cursor-pointer'
                  onClick={() => navigate('/transactions')}
                >see all</span>
              </div>
              <ul className='text-[#999898] h-[90%] overflow-hidden p-2'>
                {transactions.map((tx, i) => (
                  <li key={i}
                    className='flex justify-between mb-3'>
                    <div className='flex gap-6'>
                      <span className='text-sm font-light mr-3'>
                        {tx.category}
                      </span>
                      <div className='font-light text-sm'>
                        {tx.name}
                      </div>
                    </div>
                    <span className="text-sm mt-1">
                      {new Date(tx.date).toLocaleDateString()}
                    </span>
                    <div className={`font-light text-sm ${tx.type === "income" ? "text-green-500" : "text-red-500"
                      }`}>
                      {tx.amount}
                    </div>
                  </li>
                ))}
              </ul>

            </div>
          </div>

        </div>
      </div>
    </div>





  )
}

export default Dashboard
