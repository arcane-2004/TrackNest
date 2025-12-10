import React from 'react'
import Sidebar from '../components/Sidebar'
import { useHandleLogout } from '../utils/user.hooks'
import { LogOut } from 'lucide-react'

const Budget = () => {

	const handleLogout = useHandleLogout();

	return (
		<div className="h-full w-full bg-[#0f0f0f] text-white flex overflow-hidden">
			<Sidebar />

			<div className='flex-1 px-5 h-screen overflow-auto'>
				{/* header */}
				<div className="sticky top-0 z-10 bg-[#0f0f0f] flex items-center justify-between h-16">
					<h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
						Budget
					</h2>
					<span
						className="text-orange-500 hover:text-orange-400 hover:scale-110 transition-transform duration-200 cursor-pointer"
						onClick={handleLogout}
						title="Logout"
					>
						<LogOut size={22} />
					</span>
				</div>

				{/* main content */}
				<div>
					
				</div>
			</div>
		</div>
	)
}

export default Budget

