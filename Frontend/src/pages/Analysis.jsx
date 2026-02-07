import React from 'react';
import { useState } from 'react';
import Sidebar from '../components/Sidebar'
import { LogOut } from 'lucide-react'
import { useHandleLogout } from '../utils/user.hooks';
import PieChart from '../components/PieChart';
import { Icons } from '../assets/CategoryIcons';
import { Link } from "react-router-dom";
import Calendar from '../components/Calendar';
import TinyAreaChart from '../components/AreaChart';
import TinyBarChart from '../components/BarGraph';
import Insights from '../components/Insights';

const Analysis = () => {

	const handleLogout = useHandleLogout();

	// const [categoryData, setCategoryData] = useState([]);
	const [range, setRange] = useState('Monthly')
	const [year, setYear] = useState(new Date().getFullYear());
	const [month, setMonth] = useState(new Date().getMonth() + 1);
	const [date, setDate] = useState('')
	const [monthSummary, setMonthSummary] = useState([]);
	const [dailyExpense, setDailyExpense] = useState([]);
	const [dailyIncome, setDailyIncome] = useState([]);
	const [data, setData] = useState([]);

	return (

		<div className="flex h-full w-full bg-[#0f0f0f] text-white">
			<Sidebar />

			<div className="w-full h-full text-white px-5 overflow-y-auto h-screen relative">
				{/* Header */}

				<div className="sticky top-0 z-10 bg-[#0f0f0f]">
					<header className=" flex justify-between items-center mb-2 pb-1 h-16">
						<h2 className="font-bold text-3xl tracking-tight bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
							Analysis
						</h2>

						{/* Logout */}
						<button className=' rounded-full p-2 transition hover:bg-white/10 hover:cursor-pointer'
							onClick={handleLogout}
						>
							<LogOut className="text-orange-400" />
						</button>

					</header>

					<hr className="border-zinc-800 mb-3" />
				</div>

				{/* ----------- Main content ------------ */}

				
				<div className="mb-3 ">
					{/* ==================== insight summary ======================== */}
					<div>
						<Insights/>
					</div>
					{/* =================== pie chart ======================= */}
					<div className="w-full flex justify-between items-start gap-7 ">
						<div className='w-3/5 h-[55vh] border border-zinc-600'>

							<PieChart
								data={data}
								setData={setData}
								range={range}
								setRange={setRange}
								year={year}
								setYear={setYear}
								month={month}
								setMonth={setMonth}
								setDate={setDate}
							/>

						</div>

						{/* ----------------- Category details ---------------- */}
						<div className="p-3 pt-10  space-y-2 w-2/5 h-[55vh]  overflow-auto flex flex-col items-center justify-center">
							{data.length === 0 ? (
								<p className="text-sm text-zinc-400 italic">
									No expenses for this period
								</p>
							) : (
								data.map((category) => {
									const Icon = Icons[category.icon];

									return (
										<Link to={`/filtered/transactions/${category.id}?range=${range}&year=${year}&month=${month}&date=${date}`}
											key={category.id}
											className="flex items-center justify-between w-full rounded-xl bg-zinc-900 px-4 py-3 border border-zinc-800 hover:bg-zinc-800/70 transition-colors"
										>
											{/* Left side */}
											<div className="flex items-center gap-3">
												{/* Icon */}
												<div className="h-9 w-9 flex items-center justify-center rounded-full bg-zinc-800 text-orange-400"
													style={{ backgroundColor: category.color + '33', color: category.color }}
												>
													{Icon && <Icon size={18} />}
												</div>

												{/* Category name */}
												<div>
													<p className="text-sm font-medium text-zinc-200">
														{category.label}
													</p>
													<p className="text-xs text-zinc-400">
														{category.percentage.toFixed(2)}%
													</p>
												</div>
											</div>

											{/* Amount */}
											<div className="text-right">
												<p className="text-sm font-semibold text-orange-400">
													₹{category.value.toLocaleString("en-IN")}
												</p>
											</div>
										</Link>
									);
								})
							)}
						</div>
					</div>

					{/* ----------------------- Calendar view ---------------------			 */}
					<div className="mt-10 flex w-full gap-10">
						{/* Calendar section */}
						<div className="w-3/5 rounded-2xl ">
							<Calendar
								setMonthSummary={setMonthSummary}
								setCurrentMonthDailyExpense={setDailyExpense}
								setCurrentMonthDailyIncome={setDailyIncome}
							/>
						</div>

						{/* Stats + charts */}
						<div className="flex w-2/5 flex-col gap-6">

							{/* Income Card */}
							<div className="group relative rounded-2xl border border-zinc-800 w-4/5 py-2 px-1 h-[23vh] flex flex-col justify-between">
								<div>
									<div>
										<span className="mb-3 text-sm tracking-wide text-zinc-400">
											Month Income
										</span>

										<span className="text-xl font-semibold text-emerald-400 flex justify-center">
											₹{monthSummary.income}
										</span>

									</div>

									<div className="h-[125px] ">
										<TinyAreaChart
											data={dailyIncome}
											stroke="#06B6D4"
											fill="#06B6D4"
										/>
									</div>
								</div>
							</div>

							{/* Expense Card */}
							<div className="group relative rounded-2xl border border-zinc-800  w-4/5 py-2 px-1 h-[23vh] flex flex-col justify-between">
								<div>
									<div className="mb-3 flex items-center justify-between">
										<span className="text-sm tracking-wide text-zinc-400">
											Month Expense
										</span>

									</div>

									<span className="text-xl font-semibold text-[#ED0C0C] flex justify-center">
										₹{monthSummary.expense}
									</span>

								</div>
								<div className="h-[125px] ">
									<TinyAreaChart
										data={dailyExpense}
										stroke="#FB7185"
										fill="#FB7185"
									/>
								</div>
							</div>

						</div>
					</div>

				</div>
			</div>
		</div>
	)
}

export default Analysis
