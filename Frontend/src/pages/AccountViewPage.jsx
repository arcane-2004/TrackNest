import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Switch } from "../components/ui/switch";
import { toast } from 'react-hot-toast';

const AccountViewPage = () => {
	const { id } = useParams()
	const [transactions, setTransactions] = useState([])
	const [account, setAccount] = useState()

	useEffect(() => {
		const fetchAccountTransactions = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BASE_URL}/transaction/get/account-transaction/${id}`,
					{ withCredentials: true }
				)
				setTransactions(response.data.transactions)
				setAccount(response.data.account)
			} catch (error) {
				console.log(error.response?.data || 'Something went wrong')
			}

		}

		fetchAccountTransactions()
	}, [id])

	const onUpdateIsDefault = async (accountId) => {
		try {

			const response = await axios.post(
				`${import.meta.env.VITE_BASE_URL}/account/update-default`,
				{ accountId },
				{ withCredentials: true }
			);
			if (response.status === 200) {
				toast.success(response.data.message);
			}
		} catch (error) {
			// Rollback optimistic UI change on error
			toast.error(error.response?.data?.message || "Something went wrong");
		}
	}




	return (
		<div className="min-h-screen w-full bg-[#0f0f0f] text-white px-10 py-8 font-sans">
			{/* Header */}
			<header className="flex justify-between items-center mb-10">
				<h2 className="font-bold text-3xl tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
					TrackNest
				</h2>

				<div className="flex gap-4">
					{/* Dashboard Button */}
					<button className="relative group px-6 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-sm font-semibold text-white hover:bg-zinc-800 transition-all duration-300 hover:cursor-pointer">
						<span className="relative z-10 flex items-center gap-2">
							Dashboard
							<svg
								fill="none"
								height="16"
								viewBox="0 0 24 24"
								width="16"
								xmlns="http://www.w3.org/2000/svg"
								className="group-hover:translate-x-1 transition-transform duration-300"
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
						<span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
					</button>

					{/* Add Transaction Button */}
					<button className="relative group px-6 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-sm font-semibold text-white hover:scale-[1.03] transition-transform duration-300 hover:cursor-pointer">
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
				</div>
			</header>

			<hr className="border-zinc-800 mb-8" />



			<div className="mb-6 flex justify-between">
				<div>
					<h2 className="text-4xl font-bold">{account?.name}</h2>
					<p className='text-sm font-medium'>{account?.type}</p>
				</div>

				<div>
					<p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent tracking-tight">{new Intl.NumberFormat("en-IN", {
						style: "currency",
						currency: "INR",
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					}).format(account?.balance)}</p>
					<Switch
						className="bg-[#131313] border hover:cursor-pointer"
						checked={account?.isDefault}
						onCheckedChange={(checked) => {
							if (checked) {
								onUpdateIsDefault(account._id);
							}
						}}

					/>
				</div>


			</div>


			{/* Transactions Section */}
			<div className="bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-800">
				<h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>

				{transactions.length === 0 ? (
					<p className="text-zinc-400">No transactions found.</p>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full text-sm text-left text-zinc-300">
							<thead className="border-b border-zinc-800 text-zinc-400 uppercase text-xs tracking-wider">
								<tr>
									<th scope="col" className="py-3 px-4">Name</th>
									<th scope="col" className="py-3 px-4">Date</th>
									<th scope="col" className="py-3 px-4">Category</th>
									<th scope="col" className="py-3 px-4">Payment Method</th>
									<th scope="col" className="py-3 px-4 text-right">Amount</th>
								</tr>
							</thead>
							<tbody>
								{transactions.map((t, i) => (
									<tr
										key={i}
										className="border-b border-zinc-800 hover:bg-zinc-800/40 transition-colors duration-200"
									>
										<td className="py-3 px-4 font-medium text-white">{t.name || 'Untitled'}</td>
										<td className="py-3 px-4 text-zinc-400">
											{t.date ? new Date(t.date).toLocaleDateString() : 'N/A'}
										</td>
										<td className="py-3 px-4">{t.category || '—'}</td>
										<td className="py-3 px-4">{t.paymentMethod || '—'}</td>
										<td
											className={`py-3 px-4 text-right font-semibold ${t.amount > 0 ? 'text-emerald-400' : 'text-red-400'
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
	)
}

export default AccountViewPage
