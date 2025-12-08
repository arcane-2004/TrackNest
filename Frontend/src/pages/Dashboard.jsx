import React from 'react'
import Sidebar from '../components/Sidebar'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { LogOut } from 'lucide-react';
import { useHandleLogout } from '../utils/user.hooks';
import LineGraphChart from '../components/LineGraphChart'

const Dashboard = () => {

	const [transactions, setTransactions] = useState([]);
	const [income, setIncome] = useState('');
	const [expense, setExpense] = useState('');

	const handleLogout = useHandleLogout();

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BASE_URL}/transaction/get-transactions`,
					{ withCredentials: true }
				);
				setTransactions(response.data.transactions);
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
					><LogOut /></span>
				</div>

				<div className='h-[92%] w-full flex flex-col items-center gap-5'>
					<div className='w-full h-2/5 flex gap-4'>

						<div className=' w-3/4 flex gap-2'>

							<div className='w-4/7 border-2 border-white'>
							</div>

							<div className=' h-full w-3/7 flex flex-col gap-4 '>
								<div className='h-1/2 p-3 rounded-4xl border border-[#6d6d6d] bg-[rgba(68,81,98,0.12)] text-white'>
									<p>Your Income</p>
									<p className='text-center'>{income}</p>
								</div>
								<div className='h-1/2 p-3 rounded-4xl border border-[#6d6d6d]  bg-[rgba(68,81,98,0.12)]  backdrop-blur-md shadow-md text-white'>
									<p>Your Expense</p>
									<p className='text-center'>{expense} </p>
								</div>
							</div>
						</div>


						<div className='w-1/4 border-1 border-[#6d6d6d] bg-gradient-to-b from-black/20 to-white/10 rounded-4xl backdrop-blur-2xl shadow-md '>

							<h2 className='ml-10 mt-4'>Profile</h2>

							<div className='flex flex-col items-center justify-center text-white'>
								<div className='rounded-full h-30 w-30 bg-white '>

								</div>
								<span className='text-2xl font-bold mb-4'>Sumit</span>
								<span className='mt-5 text-xs font-medium'>Total Balance</span>
								<span className='text-4xl font-bold'>200000</span>
							</div>


						</div>

					</div>



					{/* line chart */}
					<div className='h-3/5 w-[90vw]'>
						<LineGraphChart
							transactions={transactions}
							setIncome={setIncome}
							setExpense={setExpense}
						/>
					</div>



				</div>
			</div>
		</div>





	)
}

export default Dashboard
