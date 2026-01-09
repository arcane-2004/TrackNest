import React from 'react'
import Sidebar from '../components/Sidebar'
import { LogOut } from 'lucide-react'
import { useHandleLogout } from '../utils/user.hooks';
import PieChart from '../components/PieChart';

const Analysis = () => {

	const handleLogout = useHandleLogout();

	return (

		<div className="flex h-full w-full bg-[#111010] text-white">
			<Sidebar />

			<div className="w-full text-white p-5">
				{/* Header */}
				<header className="flex justify-between items-center mb-2">
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

				{/* ----------- Main content ------------ */}

				<div className='border border-zinc-600'>
					
					<PieChart/>
				</div>
			</div>
		</div>
	)
}

export default Analysis
