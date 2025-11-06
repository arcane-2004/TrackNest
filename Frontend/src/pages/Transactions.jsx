"use client";
import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { LogOut } from "lucide-react";
import { useHandleLogout } from "../utils/user.hooks";
import axios from "axios";
import { Button } from "@/components/ui/button"
import { Ellipsis, Pencil, Trash2, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import CreateTransaction from "../components/createTransaction";
import toast from 'react-hot-toast'
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
		field: "date",
		direction: "desc"
	})
	const [isLoading, setIsLoading] = useState(null);

	const handleLogout = useHandleLogout();

	// fetching transactions
	const fetchTransactions = async () => {
		try {
			setIsLoading(true)
			const response = await axios.get(
				`${import.meta.env.VITE_BASE_URL}/transaction/get-transactions`,
				{ withCredentials: true }
			);
			console.log('response', response.data)
			setTransactions(response.data.transactions || []);
		} catch (error) {
			console.error(error.response?.data.message || "Something went wrong");
		} finally {
			setIsLoading(false)
		}
	};

	useEffect(() => {
		fetchTransactions();
	}, []);

	// const onSuccess = () => {
	// 	// fetchTransactions();
	// 	// ✅ Optimistically update UI
	// 	setTransactions((prev) => [newTransaction, ...prev]);
	// }

	const handelDelete = async (id) => {

		try {
			const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/transaction/delete`, { id },
				{
					withCredentials: true
				}
			);
			toast.success(response.data.message);
			// Remove the deleted transaction from local state
			setTransactions((prev) => prev.filter((t) => t._id !== id));


		} catch (error) {
			toast.error(error.response?.data.message || "Something went wrong");

		}
	}


	// sorting the transactions
	const sortedTransactions = useMemo(() => {
		const sorted = [...transactions];
		sorted.sort((a, b) => {
			const field = sortConfig.field;
			const direction = sortConfig.direction === "asc" ? 1 : -1;


			if (a[field] < b[field]) return -1 * direction;
			if (a[field] > b[field]) return 1 * direction;
			return 0;
		});
		return sorted;
	}, [transactions, sortConfig]);


	const handleSort = (field) => {
		setSortConfig((current) => ({
			field,
			direction: current.field == field && current.direction === "asc" ? "desc" : "asc"
		}))
	}

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
						<CreateTransaction setTransactions={setTransactions}>
							<div className="group px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-sm font-semibold text-white hover:scale-[1.03] transition-transform duration-300 shadow-md shadow-orange-500/10 hover:cursor-pointer">
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
							</div>
						</CreateTransaction>

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
				{isLoading ? <Loader2 className="animate-spin mx-auto" /> :
					<div className="bg-zinc-900 rounded-2xl p-6 shadow-xl border border-zinc-800/80">
						<h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent drop-shadow">
							Recent Transactions
						</h3>

						{sortedTransactions.length === 0 ? (
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
											onClick={() => handleSort("date")}
										>
											<div className="flex items-center">
												Date {sortConfig.field === "date" && sortConfig.direction === "asc" ?
													<ChevronUp className="text-zinc-400 font-light text-sm h-5" />
													: <ChevronDown className="text-zinc-400 font-light text-sm h-5" />}
											</div>
										</TableHead>
										<TableHead>Category</TableHead>
										<TableHead>Account</TableHead>
										<TableHead>Payment Method</TableHead>
										<TableHead className="text-right">Amount</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{sortedTransactions.map((t, i) => (
										<TableRow key={i} className="hover:bg-zinc-800/50 transition-colors">
											<TableCell className="font-medium text-white">
												{t.name || "Untitled"}
											</TableCell>
											<TableCell className="text-zinc-300">
												{t.dateTime ? (
													<div className="flex flex-col">
														<span className="text-sm font-medium text-white">
															{new Date(t.dateTime).toLocaleDateString("en-IN", {
																day: "2-digit",
																month: "short",
																year: "numeric",
															})}
														</span>
														<span className="text-xs text-zinc-500">
															{new Date(t.dateTime).toLocaleTimeString("en-IN", {
																hour: "2-digit",
																minute: "2-digit",
																hour12: true,
															})}
														</span>
													</div>
												) : (
													<span className="text-zinc-500">N/A</span>
												)}
											</TableCell>
											<TableCell className="text-zinc-300">
												<div
													className="rounded-xl w-fit h-7 p-4 shadow-md flex items-center justify-center gap-4"
													style={{
														backgroundColor: `${t.categoryId.color}22`,
														border: `1px solid ${t.categoryId.color}55`,
													}}
												>
													<div
														className="w-4 h-4 flex items-center justify-center rounded-full text-xl"
														style={{
															backgroundColor: t.categoryId.color,
															color: "#fff",
														}}
													>
														{t.categoryId.icon || "💸"}
													</div>
													<h4 className="font-semibold text-md text-white mt-2 text-center">
														{t.categoryId.name}
													</h4>

												</div>
											</TableCell>
											<TableCell className="text-zinc-300">
												{t.accountId.name || "—"}
											</TableCell>
											<TableCell className="text-zinc-300">
												{t.paymentMethod || "—"}
											</TableCell>
											<TableCell
												className={`text-right font-semibold ${!t.isExpense 
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
															onClick={() => {
																handelDelete(t._id)
															}

															}
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
				}
			</div>
		</div >
	);
};

export default Transactions;
