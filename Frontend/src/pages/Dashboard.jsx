import React from 'react'
import Sidebar from '../components/Sidebar'
import { useState, useEffect, useContext, useMemo } from 'react'
import axios from 'axios'
import { LogOut } from 'lucide-react';
import { useHandleLogout } from '../utils/user.hooks';
import LineGraphChart from '../components/LineGraphChart'
import StackedCards from '../components/StackedCards';
import { AccountContext } from '../context/AccountContext';

const Dashboard = () => {

	const { accounts } = useContext(AccountContext);

	const [transactions, setTransactions] = useState([]);
	const [userData, setUserData] = useState([])
	const [income, setIncome] = useState('');
	const [expense, setExpense] = useState('');

	const handleLogout = useHandleLogout();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BASE_URL}/user/profile`,
					{ withCredentials: true }
				);
				setUserData(response.data.user)
			} catch (err) {
				console.error(err.response?.data?.message || "Something went wrong");
			}
		};

		fetchUser();
	}, []);

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

	// -------------- calculate total balance ----------------
	const totalBalance = useMemo(() => {
		if (!accounts?.length) return 0

		return accounts.reduce((sum, acc) => sum + acc.balance, 0)
	}, [accounts])

	const formatINR = value =>
		new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			minimumFractionDigits: 2,
		}).format(value || 0)

	return (

		<div className="h-full w-full bg-[#111010] text-white flex">

			<Sidebar />

			<main className='p-3 h-full flex-1 overflow-y-auto'>
				{/* ================= Header ================= */}
				<div className='w-full h-10 mb-8 flex items-center justify-between pl-3'>
					<h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
						Dashboard
					</h2>
					<button className=' rounded-full p-2 transition hover:bg-white/10 hover:cursor-pointer'
						onClick={handleLogout}
					>
						<LogOut className="text-orange-400" />
					</button>
				</div>

				<div className='h-[90%] w-full flex flex-col items-center gap-5'>
					{/* ================= Top Section ================= */}
					<div className='w-full h-2/5 flex gap-5'>

						<div className=' w-[70%] flex gap-5' >

							<div className='w-4/7  h-full '>
								<StackedCards />
							</div>

							<div className=' h-full w-3/7 flex flex-col gap-4 '>
								<div className="h-1/2 w-full rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 p-4 border border-emerald-500/20">
									<p className="text-sm text-emerald-300">Income</p>
									<p className="mt-2 text-2xl font-semibold text-emerald-400">
										{formatINR(income)}
									</p>
								</div>
								<div className="h-1/2 w-full rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-500/5 p-4 border border-rose-500/20">
									<p className="text-sm text-rose-300">Expense</p>
									<p className="mt-2 text-2xl font-semibold text-rose-400">
										{formatINR(expense)}
									</p>
								</div>
							</div>
						</div>

						{/* ================= Profile ================= */}
						<div className="w-[25%] rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 backdrop-blur-xl border border-white/[0.08] shadow-xl">
							<h2 className="mb-5 text-sm uppercase tracking-wide text-zinc-400">
								Profile
							</h2>

							<div className="flex flex-col items-center">
								{/* Avatar */}
								<div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-300 text-3xl font-bold text-black">
									{userData.name?.[0]}
								</div>

								<p className="text-lg font-semibold">{userData.name}</p>

								<span className="mt-6 text-xs uppercase tracking-wide text-zinc-400">
									Total Balance
								</span>

								<span className="mt-2 text-4xl font-semibold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
									{formatINR(totalBalance)}
								</span>
							</div>
						</div>

					</div>



					{/* line chart */}
					<div className='h-2/5 w-[90vw]'>
						<LineGraphChart
							transactions={transactions}
							setIncome={setIncome}
							setExpense={setExpense}
						/>
					</div>



				</div>
			</main>
		</div>





	)
}

export default Dashboard
