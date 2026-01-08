import React from 'react'
import { useState, useContext, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useHandleLogout } from '../utils/user.hooks';
import { LogOut, SquarePen, Trash2 } from 'lucide-react'
import CreateBudget from '../components/CreateBudget';
import { AccountContext } from '../context/AccountContext';
import axios from 'axios';
import { Progress } from "@/components/ui/progress";
import {toast} from 'react-hot-toast';



const Budget = () => {
	const handleLogout = useHandleLogout();

	const [budget, setBudget] = useState([]);
	const [currentExpenses, setCurrentExpenses] = useState({})

	const { selectedAccountId, loadingAccount } = useContext(AccountContext);

	const fetchBudget = async () => {

		try {
			const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/budget/get-budget/${selectedAccountId}`, {
				withCredentials: true
			})
			setBudget(response.data.budget);
			setCurrentExpenses(response.data.expenses);

		}
		catch (error) {
			console.log(error.response?.data);
		}
	}

	useEffect(() => {
		if (!loadingAccount && selectedAccountId) {
			fetchBudget();
		}

	}, [loadingAccount, selectedAccountId]);


	// ------------- handleDelete to delete budget ----------
	const handleDelete = async (budgetId) => {
		try{
			const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/budget/delete-budget/${budgetId}`,
				{withCredentials: true}
			)
			toast.success(response.data.message);
			fetchBudget();

		}catch(error){
			toast.error(error?.response?.data.message || "Something Went Wrong");
		}
	}


	return (
		<div className="h-full w-full bg-[#0f0f0f] text-white flex overflow-hidden">
			<Sidebar />

			<div className='flex-1 px-5 h-screen overflow-auto'>
				{/* header */}
				<div className="sticky top-0 z-10 bg-[#0f0f0f] flex items-center justify-between h-16 mb-3">
					<h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
						Budget
					</h2>
					<div className="flex items-center gap-6">
						{/* Add Transaction Button */}
						<CreateBudget
							fetchBudget={fetchBudget}
						>
							<div className="group px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-sm font-semibold text-white hover:scale-[1.03] transition-transform duration-300 shadow-md shadow-orange-500/10 hover:cursor-pointer">
								<span className="relative z-10 flex items-center gap-2">
									Add Budget
									<svg
										fill="none"
										height="16"
										viewBox="0 0 24 24"
										width="16"
										xmlns="http://www.w3.org/2000/svg"
										className="group-hover:rotate-90 transition-transform duration-300"
									>
										<path
											d="M10.75 8.75L14.25 12L10.75 15.25"
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="1.5"
										/>
									</svg>
								</span>
							</div>
						</CreateBudget>

						{/* Logout */}
						<span
							className="text-orange-500 hover:text-orange-400 hover:scale-110 transition-transform duration-200 cursor-pointer"
							onClick={handleLogout}
							title="Logout"
						>
							<LogOut size={22} />
						</span>
					</div>
				</div>

				{/* main content */}
				<div>
					{budget.length === 0 ? (
						<div className="mt-20 text-center text-gray-400">
							No budget set yet. Click "Add Budget" to create one.
						</div>
					) : (
						<div>
							{budget.map((bgt) => {
								const used = currentExpenses?.[bgt.period] ?? 0;

								const percentUsed = bgt.limit
									? Math.min((used / bgt.limit) * 100, 100)
									: 0;
								return (
									<div key={bgt._id} className=" mb-2 rounded-2xl border border-gray-700 bg-[#1a1a1a1a] ">
										<div className="p-4 flex justify-between items-center gap-10">
											<div className="w-full " >
												<h3 className="text-lg font-semibold">{bgt.categoryId}</h3>
												<p className="text-sm text-gray-400">Limit: ₹{bgt.limit}</p>
												<p className="text-sm text-gray-400">Period: {bgt.period}</p>
												<p className="text-sm text-gray-400">Current Expense: ₹{currentExpenses?.[bgt?.period] || 0}</p>

												<Progress
													value={percentUsed}
													className="w-full mt-1"
												/>
												<div className="flex justify-between text-sm text-zinc-400">
													<span>{bgt.name}</span>
													<span>{percentUsed.toFixed(1)}%</span>
												</div>
											</div>
											<div className="flex flex-col gap-4 items-center">
												{/* Action buttons for edit and delete */}
												<CreateBudget
													budget={bgt}
													fetchBudget={fetchBudget}
												>
												<span className="text-orange-500 hover:text-orange-400 hover:scale-110 transition-transform duration-200 cursor-pointer"
												>
													<SquarePen/>
												</span>
												</CreateBudget>

												<span className=" hover:text-red-500 hover:scale-110 transition-transform duration-200 cursor-pointer"
												onClick={() => {handleDelete(bgt._id)}}
												>
													<Trash2/>
												</span>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Budget

