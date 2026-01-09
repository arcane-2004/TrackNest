import React from 'react';
import { useState } from 'react';
import Sidebar from '../components/Sidebar'
import { LogOut } from 'lucide-react'
import { useHandleLogout } from '../utils/user.hooks';
import PieChart from '../components/PieChart';
import { Icons } from '../assets/CategoryIcons';

const Analysis = () => {

	const handleLogout = useHandleLogout();

	const [categoryData, setCategoryData] = useState([]);

	console.log('categoryData', categoryData)

	return (

		<div className="flex h-full w-full bg-[#111010] text-white">
			<Sidebar />

			<div className="w-full text-white px-5 overflow-y-auto h-screen relative">
				{/* Header */}

				<div className="sticky top-0 z-10 bg-[#0f0f0f]">
					<header className=" flex justify-between items-center mb-2 pb-1 h-16">
						<h2 className="font-bold text-3xl tracking-tight bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
							Analysis
						</h2>

						{/* Logout */}
						<span
							className="text-orange-500 hover:text-orange-400 hover:scale-110 transition-transform duration-200 cursor-pointer"
							onClick={handleLogout}
							title="Logout"
						>
							<LogOut size={22} />
						</span>

					</header>

					<hr className="border-zinc-800 mb-10" />
				</div>

				{/* ----------- Main content ------------ */}
				<div className="mb-3 ">
					<div className='border border-zinc-600'>

						<PieChart
							setCategoryData={setCategoryData}
						/>
					</div>

					{/* ----------------- Category details ---------------- */}
					<div className="space-y-2 mt-3 w-full flex flex-col items-center justify-center">
						{categoryData.length === 0 ? (
							<p className="text-sm text-zinc-400 italic">
								No expenses for this period
							</p>
						) : (
							categoryData.map((category) => {
								const Icon = Icons[category.icon];

								return (
									<div
										key={category.id}
										className="flex items-center justify-between w-3/5 rounded-xl bg-zinc-900 px-4 py-3 border border-zinc-800
                     hover:bg-zinc-800/70 transition-colors"
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
									</div>
								);
							})
						)}
					</div>

				</div>
			</div>
		</div>
	)
}

export default Analysis
