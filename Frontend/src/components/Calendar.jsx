import React from 'react'
import { useEffect, useContext, useState, useMemo } from 'react';
import axios from 'axios'
import { AccountContext } from '../context/AccountContext';
import { getMonthGrid } from '../utils/calendar'
import { DotOutline } from '@phosphor-icons/react';
import { ChevronRight, ChevronLeft} from 'lucide-react';
const CalendarView = () => {

	// ----------------- Fetching and making data for events ------------------------
	const { selectedAccountId, loadingAccount } = useContext(AccountContext);

	const [dailySpending, setDailySpending] = useState([])

	const fetchCalenderData = async () => {

		try {
			const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/analysis/monthly-trend/${selectedAccountId}?year=2025`,
				{ withCredentials: true }
			)
			setDailySpending(response.data.dailySpending);
			console.log('spending', response.data.dailySpending)
		}
		catch (error) {
			console.log(error)
		}
	}

	// /-------------- Changing the dailySpending to events format ------------
	const eventData = dailySpending.map((event) => ({
		...event,
		title: event.total,
		color: '#ED0C0C'
	}))

	useEffect(() => {
		if (selectedAccountId && !loadingAccount) {
			fetchCalenderData();
		}
	}, [selectedAccountId, loadingAccount])


	// ================ calendar =====================
	// const events = [
	// 	{ title: 'Product Review', date: '2026-01-14' },
	// 	{ title: 'Project Milestone', date: '2026-01-22' },
	// ]
	const [current, setCurrent] = useState(new Date())

	const year = current.getFullYear()
	const month = current.getMonth()

	const days = getMonthGrid(year, month)

	// Group events by date
	const eventMap = useMemo(() => {
		return eventData.reduce((acc, e) => {
			acc[e.date] = acc[e.date] || []
			acc[e.date].push(e)
			return acc
		}, {})
	}, [eventData])
	console.log('eventmap', eventMap)
	const today = new Date().toISOString().split('T')[0]


	return (

		<div className="w-3/5 mx-auto p-6 rounded-2xl border border-[#1c1d22] text-zinc-200">

			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<button
					onClick={() => setCurrent(new Date(year, month - 1))}
					className="w-9 h-9 rounded-full bg-[#0a0f12] hover:bg-zinc-700 flex justify-center items-center"
				>
					<ChevronLeft className='text-[#562ca2]'/>
				</button>

				<h2 className="text-lg font-semibold">
					{current.toLocaleString('default', { month: 'long', year: 'numeric' })}
				</h2>

				<button
					onClick={() => setCurrent(new Date(year, month + 1))}
					className="w-9 h-9 rounded-full bg-[#0a0f12] hover:bg-zinc-700 flex justify-center items-center"
				>
					<ChevronRight className='text-[#562ca2]'/>
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
                ${isToday && 'ring-2 ring-violet-500 bg-[#100e1e]'}
              `}
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
										className="text-xs h-[3vh] w-full rounded-2xl truncate"
										style={{
											background: `${e.color}10`,
											color: `${e.color}`
										}}
									>
										<div className='h-full w-full flex gap-0 items-center'>
											<DotOutline className='size-8'/>
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

