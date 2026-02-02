import React from 'react'
import { useEffect, useContext, useState, useMemo } from 'react';
import axios from 'axios'
import { AccountContext } from '../context/AccountContext';
import { getMonthGrid } from '../utils/calendar'
import { DotOutline } from '@phosphor-icons/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';



const CalendarView = ({setMonthSummary, setCurrentMonthDailyExpense, setCurrentMonthDailyIncome}) => {

	// ----------------- Fetching and making data for events ------------------------
	const { selectedAccountId, loadingAccount } = useContext(AccountContext);

	const [dailyExpense, setDailyExpense] = useState([])
	const [dailyIncome, setDailyIncome] = useState([])
	

	const fetchCalenderData = async () => {

		try {
			const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/analysis/monthly-trend/${selectedAccountId}?year=${year}`,
				{ withCredentials: true }
			)
			setDailyExpense(response.data.dailySummary[0].expense)
			setDailyIncome(response.data.dailySummary[0].income)

		}
		catch (error) {
			console.log(error?.response?.data)
		}
	}



	// ---------------------- get Monthly income and expense ----------------------
	const fetchMonthSummary = async () => {
		console.log('month', month )
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BASE_URL}/analysis/month-summary/${selectedAccountId}?year=${year}&month=${month}`,
				{ withCredentials: true }
			);
			
			setMonthSummary(response.data.monthSummary);
			setCurrentMonthDailyExpense(response.data.dailyExpense);
			setCurrentMonthDailyIncome(response.data.dailyIncome)
		} catch (error) {
			console.error(error);
		}
	};


	// ================ calendar =====================

	const [current, setCurrent] = useState(new Date())

	const year = current.getFullYear()
	const month = current.getMonth()

	const days = getMonthGrid(year, month)

	useEffect(() => {
		if (selectedAccountId && !loadingAccount) {
			fetchMonthSummary();
		}
	}, [year, month, selectedAccountId, loadingAccount]);

	useEffect(() => {
		if (selectedAccountId && !loadingAccount) {
			fetchCalenderData();
		}
	}, [year, selectedAccountId, loadingAccount])


	// Group events by date
	const eventMap = useMemo(() => {
		return [...dailyExpense, ...dailyIncome].reduce((acc, e) => {
			acc[e.date] = acc[e.date] || []
			acc[e.date].push(e)
			return acc
		}, {})
	}, [dailyExpense, dailyIncome])

	const today = new Date().toISOString().split('T')[0]


	return (

		<div className="  p-6 rounded-2xl border border-[#1c1d22] text-zinc-200">

			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<button
					onClick={() => setCurrent(new Date(year, month - 1))}
					className="w-9 h-9 rounded-full bg-[#0a0f12] hover:bg-zinc-700 flex justify-center items-center"
				>
					<ChevronLeft className='text-[#ED790C]' />
				</button>

				<h2 className="text-lg font-semibold">
					{current.toLocaleString('default', { month: 'long', year: 'numeric' })}
				</h2>

				<button
					onClick={() => setCurrent(new Date(year, month + 1))}
					className="w-9 h-9 rounded-full bg-[#0a0f12] hover:bg-zinc-700 flex justify-center items-center"
				>
					<ChevronRight className='text-[#ED790C]' />
				</button>
			</div>

			{/* Weekdays */}
			<div className="grid grid-cols-7 text-center text-xs font-semibold mb-2">
				{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
					<div key={d} className="py-2 text-zinc-400">
						{d}
					</div>
				))}
			</div>

			{/* Grid */}
			<div className="grid grid-cols-7 gap-px   overflow-hidden">
				{days.map((d, i) => {
					const key = d.date.toISOString().split('T')[0]
					const isToday = key === today

					return (
						<div
							key={i}
							className={`relative h-25 p-2 
                ${d.currentMonth ? 'bg-[#0a0f12]' : 'bg-transparent'}
                ${isToday && 'border-2 border-[#ED790C] bg-[#17140A]'}
              `}
			//   border-[#8e51ff] bg-[#100e1e]
						>
							{/* Date */}
							<span className="absolute top-2 right-2 text-sm">
								{d.date.getDate()}
							</span>

							{/* Events */}
							<div className="mt-6 w-full">
								{eventMap[key]?.map((e, idx) => (
									<div
										key={idx}
										className="mt-1.5 text-xs h-[3vh] w-full rounded-2xl truncate"
										style={{
											background: `${e.color}10`,
											color: `${e.color}`
										}}
									>
										<div className='h-full w-full flex gap-0 items-center'>
											<DotOutline className='size-8' />
											<span>{e.title}</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default CalendarView

