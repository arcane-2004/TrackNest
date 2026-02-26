import React, { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast';
import { ChevronUp, ChevronDown, Loader2, Trash2 } from 'lucide-react';
import TransactionCard from '../components/TransactionCard';


import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import CreateAccount from '../components/CreateAccount';
import Sidebar from '../components/Sidebar';
import ConfirmAccountDelete from '../components/ConfirmAccountDelete';

const AccountViewPage = () => {



	const { id } = useParams()
	const [transactions, setTransactions] = useState([])
	const [account, setAccount] = useState()
	const [sortConfig, setSortConfig] = useState({
		field: "date",
		direction: "desc"
	})

	// Fetch current account transactions
	const fetchAccountTransactions = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BASE_URL}/transaction/get/account-transaction/${id}`,
				{ withCredentials: true }
			)
			setTransactions(response.data.transactions)
		} catch (error) {
			console.log(error.response?.data || 'Something went wrong')
		}
	}

	// Fetch current account details
	const fetchAccount = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BASE_URL}/account/get/account/${id}`,
				{ withCredentials: true }
			)
			setAccount(response.data.account)
		} catch (error) {
			console.log(error.response?.data || 'Something went wrong')
		}
	}

	useEffect(() => {
		fetchAccountTransactions();
		fetchAccount()
	}, [])


	const onUpdateAccount = () => {
		fetchAccount();
	}

	const onSuccess = () => {
		fetchAccountTransactions();
	}

	const handelDeleteTransaction = async (id) => {

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

	const handleDeleteAccount = async () => {
		try {
			const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/account/delete/${id}`, {
				withCredentials: true
			});

			toast.success(response.data.message);
		} catch (error) {

			toast.error(error.response?.data?.message || "Something went wrong")
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
		<div className='h-full w-full bg-[#0f0f0f] text-white flex overflow-hidden'>
			<Sidebar />
			<div className="w-full bg-[#0f0f0f] text-white px-5 font-sans overflow-y-auto h-screen relative">
				{/* Header */}
				<div className=' sticky top-0 z-10 bg-[#0f0f0f] '>
					<header className="h-16 flex items-center justify-between pb-1">
						<h2 className="font-bold text-3xl tracking-tight bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
							Account
						</h2>

						<div className="flex gap-4">
							{/* Delete Button */}
							<ConfirmAccountDelete
								accountName={account?.name}
								onConfirm={handleDeleteAccount}
							>
								<div
									className="flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-700 bg-zinc-900 text-white text-sm font-medium hover:bg-red-600 hover:border-red-600 transition-colors duration-200 cursor-pointer"
								>
									<Trash2 className="h-4 w-4" />
									<span>Delete</span>
								</div>

							</ConfirmAccountDelete>

							{/* Add Transaction Button */}
							<CreateAccount
								account={account}
								onUpdateAccount={onUpdateAccount}
								id={id}>

								<div className="relative group px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-sm font-semibold text-white hover:scale-[1.03] transition-transform duration-300 hover:cursor-pointer shadow-md shadow-orange-500/10">


									<span className="relative z-10 flex items-center gap-2">
										Edit Account
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
							</CreateAccount>
						</div>

					</header>
					<hr className="border-zinc-800 mb-8" />
				</div>


				{/* Account Info */}
				<div className="mb-6 flex justify-between items-center">
					<div>
						<h2 className="text-4xl font-bold text-white">{account?.name}</h2>
						<p className="text-sm text-zinc-400 font-medium">{account?.type}</p>
					</div>

					<div className="text-right">
						<p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
							{new Intl.NumberFormat("en-IN", {
								style: "currency",
								currency: "INR",
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							}).format(account?.balance || 0)}
						</p>
						<div className="flex items-center justify-end mt-2 gap-2">
							<p className="text-xs text-zinc-500">
								{account?.isDefault ? "Default Account" : ""}
							</p>

						</div>
					</div>
				</div>

				{/* Transactions Section */}
				<div className="bg-zinc-900 rounded-2xl p-6 shadow-xl border border-zinc-800/80">
					<h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent drop-shadow">
						Recent Transactions
					</h3>

					{transactions.length === 0 ? (
						<p className="text-zinc-400 text-sm italic">No transactions found.</p>
					) : (
						<div className="overflow-x-auto rounded-lg border border-zinc-800/50">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[180px]">Name</TableHead>
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
										<TableHead className="text-right">Amount</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{sortedTransactions.map((t, i) => (
										<TransactionCard
											key={i}
											t={t}
											handelDelete={handelDeleteTransaction}
											onSuccess={onSuccess}
										/>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default AccountViewPage
