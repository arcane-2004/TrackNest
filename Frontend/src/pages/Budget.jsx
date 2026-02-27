import React from 'react'
import { useState, useContext, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useHandleLogout } from '../utils/user.hooks';
import { LogOut, } from 'lucide-react'
import CreateBudget from '../components/CreateBudget';
import { AccountContext } from '../context/AccountContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import BudgetCard from '../components/BudgetCard';



const Budget = () => {
	const handleLogout = useHandleLogout();

	const [budgets, setBudgets] = useState([]);
	const [systemBudgetInsights, setSystemBudgetInsights] = useState([]);
	const [aiBudgetInsights, setAiBudgetInsights] = useState(null)
	const [editBudget, setEditBudget] = useState(null)
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false)

	const { selectedAccountId, loadingAccount } = useContext(AccountContext);

	const fetchBudget = async () => {

		try {
			const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/budget/get-budget/${selectedAccountId}`, {
				withCredentials: true
			})
			setBudgets(response.data.budgets);
			
		}
		catch (error) {
			console.log(error.response?.data);
		}
	}

	const fetchSystemBudgetInsights = async () => {
		try {
			const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/analysis/budgets/system-insights/${selectedAccountId}`,
				{
					withCredentials: true
				}
			)
			setSystemBudgetInsights(response.data.systemBudgetInsights)

		} catch (error) {
			console.log(error.response?.data)
		}
	}

	const handldFetchAiInsights = async () => {

		try {
			setLoading(true)

			const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/analysis/budgets/ai-insights/${selectedAccountId}`, { systemBudgetInsights },
				{
					withCredentials: true
				}
			)

			setAiBudgetInsights(response.data.aiBudgetInsights);

		} catch (error) {
			console.log(error.response)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (!loadingAccount && selectedAccountId) {
			fetchBudget();
			fetchSystemBudgetInsights()
		}

	}, [loadingAccount, selectedAccountId]);

	let budgetsInfo;
	if (systemBudgetInsights && budgets) {
		const systemBudgetInsightMap = new Map(
			(systemBudgetInsights ?? []).map(({ budgetId, messages }) => [
				budgetId,
				messages
			])
		);

		budgetsInfo = (budgets ?? []).map(budget => ({
			...budget,
			messages: systemBudgetInsightMap.get(budget.budgetId) ?? []
		}));

	}

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
					{budgetsInfo.length === 0 ? (
						<div className="mt-20 text-center text-gray-400">
							No budget set yet. Click "Add Budget" to create one.
						</div>
					) : (
						<div>
							<div className='w-full mb-6 rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur px-6 py-4  hover:border-white/20 transition'>
								<div
									className="flex items-center justify-between gap-6 mb-6"
								>
									{/* LEFT: Text */}
									<div>
										<p className="text-sm font-medium text-white">
											AI Budget Summary
										</p>
										<p className="text-xs text-zinc-400 mt-1">
											Get a clear, combined overview of all your budgets
										</p>
									</div>

									{/* RIGHT: Action */}
									<button
										className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"

										onClick={() => { handldFetchAiInsights() }}
										button disabled={loading}
									>
										{
											loading ? 'Generating...' :
												'Generate'
										}
									</button>
								</div>
								<div>
									{aiBudgetInsights && (
										<div
											className=" rounded-2xl border border-orange-500/30 bg-orange-500/5 px-6 py-5"
										>
											<div className="flex items-center gap-2 mb-2">
												<span className="text-orange-400 font-semibold text-sm">
													AI Insight
												</span>
											</div>

											<p className="text-white text-sm leading-relaxed">
												{aiBudgetInsights.summary}
											</p>

											{aiBudgetInsights.highlights?.length > 0 && (
												<ul className="mt-3 space-y-1">
													{aiBudgetInsights.highlights.map((h, i) => (
														<li key={i} className="text-sm text-zinc-300">
															• {h}
														</li>
													))}
												</ul>
											)}

											{aiBudgetInsights.tips?.length > 0 && (
												<div className="mt-4 pt-3 border-t border-white/10">
													<p className="text-xs text-zinc-400 mb-2">Suggestions</p>
													<ul className="space-y-1">
														{aiBudgetInsights.tips.map((t, i) => (
															<li key={i} className="text-xs text-zinc-300">
																– {t}
															</li>
														))}
													</ul>
												</div>
											)}
										</div>
									)}

								</div>

							</div>

							<div>
								{budgetsInfo.map((bgt) => (

									<BudgetCard
										bgt={bgt}
										setEditBudget={setEditBudget}
										handleDelete={handleDelete}
										setOpen={setOpen}
									/>
								))}
							</div>
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

