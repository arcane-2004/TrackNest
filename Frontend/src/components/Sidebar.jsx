import React from 'react'
import { motion } from 'motion/react'
import { useState } from 'react';
import { User, House, NotebookTabs, Wallet, Logs } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Sidebar = () => {

    const [isHovered, setIsHovered] = useState(false);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    const navigate = useNavigate();

    const sideBarVarient = {
        collapsed: {
            width: "80px",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3
            }
        },

        expanded: {
            width: "280px",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3
            }
        }
    }

    const textVarient = {
        collapsed: {
            opacity: 0,
            x: -10,
            transition: {
                duration: 0.1
            }
        },

        expanded: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.1,
                delay: 0.2
            }
        }
    }

    const containerVarients = {
        collapsed: {
            transition: {
                staggerChildren: 0.03,
                delayChildren: 0
            }
        },

        expanded: {
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        collapsed: {
            x: 0,
            transition: {
                duration: 0.2
            }
        },
        expanded: {
            x: 0,
            transition: {
                duration: 0.2
            }
        }
    };

    const menuItems = [
        { id: "dashboard", icon: House, lable: "Dashboard", path: "/dashboard" },
        { id: "user", icon: User, lable: "Userdafdadsaf", path: "/profile" },
        { id: "transactions", icon: NotebookTabs, lable: "Transactions", path: "/transactions" },
        { id: "accounts", icon: Wallet, lable: "Accounts", path: "/accounts" },
        { id: "category", icon: Logs, lable: "Category", path: "/category" }

    ]

    const isActiveRoute = (itemPath) => {
        return currentPath === itemPath;
    }

    const handleNavigation = (path) => {
        setCurrentPath(path);
        navigate(path)
    }


    return (
        <div className='h-full flex-shrink-0'>
            <motion.div
                className='h-full bg-transparent shadow-lg flex-shrink-0 border-r-1 border-[#454545]'
                initial='collapsed'
                animate={isHovered ? "expanded" : "collapsed"}
                variants={sideBarVarient}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="sticky top-0 h-screen overflow-hidden">
                    <div className='h-16 border-[#D9D9DD] border-b p-3'>
                        <div className='flex items-center'
                        >
                            <span>Logo</span>
                            <motion.h1 className='text-[#fff] m-2 font-bold text-2xl '
                                variants={textVarient}
                            >
                                TrackNest
                            </motion.h1>
                        </div>

                        {/* navigation */}
                        <motion.nav
                            className='flex-1 py-4'
                            variants={containerVarients}
                        >
                            <ul>
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = isActiveRoute(item.path);
                                    return (
                                        <motion.li
                                            className='text-[#454545] '
                                            key={item.id}
                                            variants={itemVariants}
                                        >
                                            <button
                                                onClick={() => handleNavigation(item.path)}
                                                className={`w-full relative group rounded-full p-2 mt-5 flex gap-4 hover:cursor-pointer ${isActive
                                                    ? 'bg-gradient-to-r from-[#363636] via-transparent to-transparent backdrop-blur-lg shadow-inner border-r-3 border-r-[#505050] text-[#fff] '

                                                    : 'bg-none text-[#454545] hover:bg-[#232222] hover:text-slate-100 hover:shadow-md'
                                                    }`}
                                            >


                                                <div>
                                                    {<item.icon />}
                                                </div>
                                                <motion.div
                                                    className='overflow-hidden'
                                                    variants={textVarient}
                                                >
                                                    {item.lable}
                                                </motion.div>

                                                {/* Active indicator */}
                                                {/* {isActive && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r"></div>
                                            )} */}

                                                {/* {!isHovered && (
                                                <div className="absolute left-full ml-2 px-2 py-1 bg-[#000000] text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                                    {item.lable}
                                                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                                                </div>
                                            )} */}

                                            </button>

                                        </motion.li>
                                    )
                                })}
                            </ul>
                        </motion.nav>

                    </div>
                </div>
                <div className='h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center absolute bottom-0 m-4'>
                    <span>SK</span>
                </div>
            </motion.div >



        </div >

    )
}

export default Sidebar
