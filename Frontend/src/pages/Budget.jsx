import React from 'react'
import { useState, useContext, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useHandleLogout } from '../utils/user.hooks';
import { LogOut, SquarePen, Trash2 } from 'lucide-react'
import CreateBudget from '../components/CreateBudget';
import { AccountContext } from '../context/AccountContext';
import axios from 'axios';
import { Progress } from "@/components/ui/progress";
import { toast } from 'react-hot-toast';
import SimpleGauge from '../components/ProgressGauge';
import { Icons } from "../assets/CategoryIcons"


const Budget = () => {
	const handleLogout = useHandleLogout();

	const [budgets, setBudgets] = useState([]);
	const [editBudget, setEditBudget] = useState(null)
	const [open, setOpen] = useState(false);

	const { selectedAccountId, loadingAccount } = useContext(AccountContext);
	const fetchBudget = async () => {

		try {
			const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/budget/get-budget/${selectedAccountId}`, {
				withCredentials: true
			})
			setBudgets(response.data.budgets);
			
			console.log('res', response.data.budgets)
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
		try {
			const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/budget/delete-budget/${budgetId}`,
				{ withCredentials: true }
			)
			toast.success(response.data.message);
			fetchBudget();

		} catch (error) {
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
							open={open}
							setOpen={setOpen}
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
						<button className=' rounded-full p-2 transition hover:bg-white/10 hover:cursor-pointer'
							onClick={handleLogout}
						>
							<LogOut className="text-orange-400" />
						</button>
					</div>
				</div>

				{/* main content */}
				<div>
					{budgets.length === 0 ? (
						<div className="mt-20 text-center text-gray-400">
							No budget set yet. Click "Add Budget" to create one.
						</div>
					) : (
						<div>
							{budgets.map((bgt) => (

								<div
									key={bgt.budgetId}
									className="mb-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 hover:border-white/40 hover:shadow-xl hover:shadow-white/10 transition-colors"
								>
									<div className="p-5 flex items-center justify-between gap-6">

										{/* LEFT: Budget info */}
										<div className="flex items-start gap-6 w-full">

											<div className="min-w-[220px]">
												<div className="flex items-center gap-3">
													<div
														className="h-10 w-10 rounded-full flex items-center justify-center border"
														style={{
															color: bgt.categoryId?.color,
															backgroundColor: `${bgt.categoryId?.color}22`,
															borderColor: `${bgt.categoryId?.color}55`,
														}}
													>
														{bgt.categoryId?.icon && Icons[bgt.categoryId.icon] ? (
															(() => {
																const Icon = Icons[bgt.categoryId.icon];
																return <Icon className="h-6 w-6" />;
															})()
														) : (
															<span className="text-sm font-semibold">₹</span> // fallback
														)}
													</div>

													<h3 className="text-lg font-semibold text-white">
														{bgt.categoryId?.name || "Overall Budget"}
													</h3>
												</div>


												<p className="mt-1 text-sm text-zinc-400">
													Period: <span className="text-zinc-300">{bgt.period}</span>
												</p>

												<div className="mt-3 space-y-1">
													<p className="text-sm text-zinc-400">
														Limit:
														<span className="ml-1 font-medium text-zinc-200">
															₹{bgt.limit}
														</span>
													</p>

													<p className="text-sm text-zinc-400">
														Spent:
														<span
															className={`ml-1 font-medium ${bgt.spent > bgt.limit
																? "text-red-500"
																: "text-orange-400"
																}`}
														>
															₹{bgt.spent || 0}
														</span>
													</p>
												</div>
											</div>

											{/* CENTER: Gauge */}
											<div className="flex-1 flex justify-center">
												<SimpleGauge value={bgt.percentUsed} />
											</div>
										</div>

										{/* RIGHT: Actions */}
										<div className="flex flex-col items-center gap-3 pl-4 border-l border-zinc-800">
											<button className="p-2 rounded-lg text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 transition"
												onClick={() => {
													setEditBudget(bgt)
													setOpen(true);
												}}
											>
												<SquarePen size={18} />
											</button>


											<button
												onClick={() => handleDelete(bgt.budgetId)}
												className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition"
											>
												<Trash2 size={18} />
											</button>
										</div>
									</div>
								</div>


							))}


						</div>
					)}

				</div>
			</div>
			<CreateBudget
				budget={editBudget}
				open={open}
				setOpen={setOpen}
				onClose={() => setEditBudget(null)}
				fetchBudget={fetchBudget}>
			</CreateBudget>
		</div>
	)
}

export default Budget

