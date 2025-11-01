"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { LogOut } from "lucide-react";
import { useHandleLogout } from "../utils/user.hooks";
import axios from "axios";
import { Button } from "@/components/ui/button"
import { Ellipsis, Pencil, Trash2 } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Transactions = () => {
	const [transactions, setTransactions] = useState([]);
	const [sortConfig, setSortConfig] = useState({
		
	})

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
						Transactions
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
						<Table>


							<TableHeader>
								<TableRow>
									<TableHead className="w-[180px]">Name</TableHead>
									<TableHead
										className="cursor-pointer"
									// onClick={() => handleSort("date")}
									>
										Date
									</TableHead>
									<TableHead>Category</TableHead>
									<TableHead>Account</TableHead>
									<TableHead>Payment Method</TableHead>
									<TableHead className="text-right">Amount</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{transactions.map((t, i) => (
									<TableRow key={i} className="hover:bg-zinc-800/50 transition-colors">
										<TableCell className="font-medium text-white">
											{t.name || "Untitled"}
										</TableCell>
										<TableCell className="text-zinc-400">
											{t.date
												? new Date(t.date).toLocaleDateString()
												: "N/A"}
										</TableCell>
										<TableCell className="text-zinc-300">
											{t.category || "—"}
										</TableCell>
										<TableCell className="text-zinc-300">
											{t.accountName || "—"}
										</TableCell>
										<TableCell className="text-zinc-300">
											{t.paymentMethod || "—"}
										</TableCell>
										<TableCell
											className={`text-right font-semibold ${t.amount > 0
												? "text-emerald-400"
												: "text-red-400"
												}`}
										>
											₹{t.amount}
										</TableCell>
										<TableCell align="right">
											<DropdownMenu  >
												<DropdownMenuTrigger asChild>

													<Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
														<Ellipsis className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													className="w-40 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl shadow-lg p-1"
												>
													<DropdownMenuLabel className="text-xs uppercase tracking-wider text-zinc-500 px-2 py-1">
														Actions
													</DropdownMenuLabel>

													<DropdownMenuItem
														className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-zinc-800 hover:text-orange-400 cursor-pointer transition-colors"
													>
														<Pencil className="h-4 w-4 text-zinc-400 group-hover:text-orange-400" />
														<span>Edit</span>
													</DropdownMenuItem>

													<DropdownMenuItem
														className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-red-600/10 hover:text-red-400 cursor-pointer transition-colors"
													>
														<Trash2 className="h-4 w-4 text-zinc-400 group-hover:text-red-400" />
														<span>Delete</span>
													</DropdownMenuItem>
												</DropdownMenuContent>

											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>
			</div>
		</div>
	);
};

export default Transactions;
