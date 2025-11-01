import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { LogOut } from "lucide-react";
import { useHandleLogout } from "../utils/user.hooks";
import axios from "axios";

const Transactions = () => {
	const [transactions, setTransactions] = useState([]);
	const handleLogout = useHandleLogout();

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BASE_URL}/transaction/get-transactions`,
					{ withCredentials: true }
				);
				setTransactions(response.data.transactions || []);
			} catch (error) {
				console.error(error.response?.data || "Something went wrong");
			}
		};
		fetchTransactions();
	}, []);

	return (
		<div className="h-full w-full bg-[#0f0f0f] text-white flex">
			{/* Sidebar */}
			<Sidebar />

			{/* Main Content */}
			<div className="flex-1 p-8">
				{/* Header */}
				<div className="relative mb-10 flex items-center justify-between">
					<h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
						Dashboard
					</h2>

					<div className="flex items-center gap-6">
						{/* Add Transaction Button */}
						<button className="group px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-sm font-semibold text-white hover:scale-[1.03] transition-transform duration-300 shadow-md shadow-orange-500/10 hover:cursor-pointer">
							<span className="relative z-10 flex items-center gap-2">
								Add Transaction
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
						</button>

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

				{/* Transactions Table */}
				<div className="bg-zinc-900 rounded-2xl p-6 shadow-xl border border-zinc-800/80">
					<h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent drop-shadow">
						Recent Transactions
					</h3>

					{transactions.length === 0 ? (
						<p className="text-zinc-400 text-sm italic">
							No transactions found.
						</p>
					) : (
						<div className="overflow-x-auto rounded-lg border border-zinc-800/50">
							<table className="min-w-full text-sm text-left text-zinc-300">
								<thead className="bg-[#1a1a1a] border-b border-zinc-800 text-zinc-400 uppercase text-xs tracking-wider">
									<tr>
										<th scope="col" className="py-3 px-4">
											Name
										</th>
										<th scope="col" className="py-3 px-4">
											Date
										</th>
										<th scope="col" className="py-3 px-4">
											Category
										</th>
										<th scope="col" className="py-3 px-4">
											Account
										</th>
										<th scope="col" className="py-3 px-4">
											Payment Method
										</th>
										<th
											scope="col"
											className="py-3 px-4 text-right"
										>
											Amount
										</th>
									</tr>
								</thead>

								<tbody>
									{transactions.map((t, i) => (
										<tr
											key={i}
											className="border-b border-zinc-800 hover:bg-[#1b1b1b] transition-colors duration-150"
										>
											<td className="py-3 px-4 font-medium text-white">
												{t.name || "Untitled"}
											</td>
											<td className="py-3 px-4 text-zinc-400">
												{t.date
													? new Date(
															t.date
													  ).toLocaleDateString()
													: "N/A"}
											</td>
											<td className="py-3 px-4 text-zinc-300">
												{t.category || "—"}
											</td>
											<td className="py-3 px-4 text-zinc-300">
												{t.name || "—"}
											</td>
											<td className="py-3 px-4 text-zinc-300">
												{t.paymentMethod || "—"}
											</td>
											<td
												className={`py-3 px-4 text-right font-semibold ${
													t.amount > 0
														? "text-emerald-400"
														: "text-red-400"
												}`}
											>
												₹{t.amount}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Transactions;
