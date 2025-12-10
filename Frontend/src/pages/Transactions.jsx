"use client";
import React, { useState, useEffect, useMemo, useContext } from "react";
import Sidebar from "../components/Sidebar";
import { LogOut } from "lucide-react";
import { useHandleLogout } from "../utils/user.hooks";
import axios from "axios";
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import CreateTransaction from "../components/createTransaction";
import toast from 'react-hot-toast'
import TransactionCard from "../components/TransactionCard"
import { ScrollArea } from '../components/ui/scroll-area'
import { AccountContext } from "../context/AccountContext"

import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const Transactions = () => {

	const { selectedAccountId, selectedAccount, loadingAccount } = useContext(AccountContext);
	console.log(selectedAccount)

	const [transactions, setTransactions] = useState([]);
	const [sortConfig, setSortConfig] = useState({
		field: "date",
		direction: "desc"
	})
	const [isLoading, setIsLoading] = useState(null);
	const [typeFilter, setTypeFilter] = useState("All")


	const handleLogout = useHandleLogout();

	// fetching transactions
	const fetchTransactions = async () => {
		try {
			setIsLoading(true)
			const response = await axios.get(
				`${import.meta.env.VITE_BASE_URL}/transaction/get/account-transaction/${selectedAccountId}`,
				{ withCredentials: true }
			);
			setTransactions(response.data.transactions || []);
		} catch (error) {
			console.error(error.response?.data.message || "Something went wrong");
		} finally {
			setIsLoading(false)
		}
	};

	useEffect(() => {
		if (!loadingAccount && selectedAccountId) {
			fetchTransactions();
		}

	}, [loadingAccount, selectedAccountId]);

	const onSuccess = () => {
		fetchTransactions();
	}


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

	const sortedTransactions = useMemo(() => {

		// 1. Make a copy
		let sorted = [...transactions];

		// 2. Sort
		sorted.sort((a, b) => {
			const field = sortConfig.field;
			const direction = sortConfig.direction === "asc" ? 1 : -1;

			if (a[field] < b[field]) return -1 * direction;
			if (a[field] > b[field]) return 1 * direction;
			return 0;
		});

		// 3. Filter by type
		if (typeFilter !== "All") {
			sorted = sorted.filter(t =>
				typeFilter === "Income" ? !t.isExpense : t.isExpense
			);
		}

		// 4. Return result
		return sorted;

	}, [transactions, sortConfig, typeFilter]);

	const handleSort = (field) => {
		setSortConfig((current) => ({
			field,
			direction: current.field == field && current.direction === "asc" ? "desc" : "asc"
		}))
	}

	return (
		<div className="h-full w-full bg-[#0f0f0f] text-white flex overflow-hidden">
			{/* Sidebar */}
			<Sidebar />

			{/* Main Content */}
			<div className="flex-1 px-5 overflow-y-auto h-screen relative">
				{/* Header */}
				<div className="sticky top-0 z-10 bg-[#0f0f0f] pb-1">
					<div className="flex items-center justify-between h-16">
						<h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
							Transactions
						</h2>

						<div className="flex items-center gap-6">
							{/* Add Transaction Button */}
							<CreateTransaction onSuccess={onSuccess}>
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

					{/* Account Info */}
					<div className="mb-6 flex justify-between items-center">
						<div>
							<h2 className="text-4xl font-bold text-white">{selectedAccount?.name}</h2>
							<p className="text-sm text-zinc-400 font-medium">{selectedAccount?.type}</p>
						</div>

						<div className="text-right">
							<p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
								{new Intl.NumberFormat("en-IN", {
									style: "currency",
									currency: "INR",
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								}).format(selectedAccount.balance || 0)}
							</p>

						</div>
					</div>
				</div>


				{/* Transactions Table */}
				{isLoading ? <Loader2 className="animate-spin mx-auto" /> :
					<div className=" bg-zinc-900 rounded-2xl p-6 shadow-xl border border-zinc-800/80 mb-4">

						<div className="flex items-center justify-between">

							<h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent drop-shadow">
								Recent Transactions
							</h3>

							{/* typeFilter */}
							<div className="flex items-center justify-end gap-3 mb-4">
								<Label htmlFor="typeFilter" className="text-zinc-300 text-sm">
									Type
								</Label>

								<Select value={typeFilter} onValueChange={setTypeFilter}>
									<SelectTrigger
										id="typeFilter"
										className="w-[180px] bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-all duration-200 ring-0 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 border-0 shadow-none"
									>
										<SelectValue placeholder={typeFilter} />
									</SelectTrigger>

									<SelectContent
										className="bg-zinc-800  border-0 text-zinc-200 shadow-xl rounded-md"
									>
										<SelectItem value="All" className="cursor-pointer focus:bg-zinc-800">
											All
										</SelectItem>
										<SelectItem value="Income" className="cursor-pointer focus:bg-zinc-800 text-emerald-400">
											Income
										</SelectItem>
										<SelectItem value="Expense" className="cursor-pointer focus:bg-zinc-800 text-red-400">
											Expense
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						{sortedTransactions.length === 0 ? (
							<p className="text-zinc-400 text-sm italic">
								No transactions found.
							</p>
						) : (
							<div>
								<Table className="min-w-full">

									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead
												className="cursor-pointer"
												onClick={() => handleSort("dateTime")}
											>
												<div className="flex items-center">
													Date {sortConfig.field === "dateTime" && sortConfig.direction === "asc" ?
														<ChevronUp className="text-zinc-400 font-light text-sm h-5" />
														: <ChevronDown className="text-zinc-400 font-light text-sm h-5" />}
												</div>
											</TableHead>
											<TableHead>Category</TableHead>
											<TableHead>Account</TableHead>
											<TableHead>Payment Method</TableHead>
											<TableHead>Amount</TableHead>
										</TableRow>
									</TableHeader>

									<TableBody className="scroll-y-auto h-[80%]">
										{sortedTransactions.map((t, i) => (
											<TransactionCard
												key={i}
												t={t}
												handelDelete={handelDelete}
												onSuccess={onSuccess}
											/>
										))}
									</TableBody>
								</Table>
							</div>




						)}
					</div>
				}
			</div>
		</div >
	);
};

export default Transactions;
