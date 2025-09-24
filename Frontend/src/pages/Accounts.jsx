import React from 'react'
import Sidebar from '../components/Sidebar'
import { Loader2, LogOut, Plus } from 'lucide-react';
import { useHandleLogout } from '../utils/user.hooks'
import CreateAccount from '../components/CreateAccount';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'
import { ScrollArea } from '../components/ui/scroll-area'
import { Switch } from '../components/ui/switch'
import { Link } from 'react-router-dom';
import AccountCard from '../components/AccountCard';


const Accounts = () => {


    const [accounts, setAccounts] = useState([])
    const [isLoading, setIsLoading] = useState(null);


    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/account/get-accounts`,
                { withCredentials: true }
            );

            if (response.status === 200) {
                setAccounts(response.data.accounts);
            }
            else {
                toast.error(response.data.message || "Something went wrong")
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const refreshAccounts = () => {
        fetchAccounts(); // re-fetch accounts when a new account is added
    };

    const handleUpdateIsDefault = async (accountId) => {
        const previousAccounts = [...accounts];

        setAccounts(prev =>
            prev.map(acc =>
                acc._id === accountId
                    ? { ...acc, isDefault: true }
                    : { ...acc, isDefault: false }
            )
        );

        try {
            setIsLoading(true);
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
            setAccounts(previousAccounts);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }


    const handleLogout = useHandleLogout();

    return (
        <div className='h-full w-full bg-[#111010] text-white flex'>
            <div>
                <Sidebar />
            </div>
            <div className='p-3 h-full w-full'>
                <div className='relative w-full h-10 mb-8 flex items-center p-5'>
                    <h2 className='absolute text-2xl font-bold right-20'>Accounts</h2>
                    <span className='absolute right-5 text-[#ae5921] hover:cursor-pointer'
                        onClick={handleLogout}
                        
                    ><LogOut /></span>
                </div>

                {/* card area */}
                <ScrollArea className='p-5 h-[92%] '>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-5">
                        <CreateAccount onAccountAdded={refreshAccounts}>
                            <div className=" h-[25vh] p-4 rounded-2xl text-white flex flex-col items-center justify-center 
                        bg-[rgba(68,81,98,0.28)] hover:cursor-pointer ">
                                <div className='text-lg font-bold text-orange-600'>
                                    <Plus />
                                </div>
                                <p className='text-lg font-figtree font-medium '>Add new account</p>
                            </div>
                        </CreateAccount>


                        {isLoading ? <Loader2 className="animate-spin mx-auto" /> :
                            accounts.map(account => (
                                <AccountCard
                                    key={account._id}
                                    account={account}
                                    onUpdateIsDefault={handleUpdateIsDefault}
                                    isLoading={isLoading}
                                />
                            ))}

                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}

export default Accounts
