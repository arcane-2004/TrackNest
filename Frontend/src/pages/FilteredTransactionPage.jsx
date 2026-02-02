import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from 'react-router-dom'
import Sidebar from "../components/Sidebar";
import { LogOut, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { useHandleLogout } from "../utils/user.hooks";
import axios from "axios";
import CreateTransaction from "../components/createTransaction";
import toast from 'react-hot-toast'
import TransactionCard from "../components/TransactionCard"

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Label } from "@/components/ui/label"

const FilteredTransactionPage = () => {

    const [searchParams] = useSearchParams();

    const { categoryId } = useParams();
    const range = searchParams.get('range');
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const date = searchParams.get('date');

    const [transactions, setTransactions] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        field: "date",
        direction: "desc"
    })
    const [isLoading, setIsLoading] = useState(null);
    const [totalTransactions, setTotalTransactions] = useState(0);



    const handleLogout = useHandleLogout();

    // fetching transactions
    const fetchTransactions = async () => {
        try {

            setIsLoading(true)
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/analysis/category/get-transactions/${categoryId}`,
                {
                    params: {
                        range,                          // Daily | Monthly | Yearly | All
                        year,                           // e.g. 2025
                        month: range === "Monthly" ? month : undefined,
                        date: date
                    },
                    withCredentials: true
                }
            );
            setTransactions(response.data.transactions || []);
            setTotalTransactions(response.data.transactions.length || 0)

        } catch (error) {
            console.error(error.response?.data.message || "Something went wrong");
        } finally {
            setIsLoading(false)


        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

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
        // 4. Return result
        return sorted;

    }, [transactions, sortConfig,]);
    console.log('sorted', sortedTransactions)

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
                            Transactions Analysis
                        </h2>

                        <div className="flex items-center gap-6">
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
                    {/* <div className="mb-6 flex justify-between items-center">
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
                        </div> */}
                </div>


                {/* Transactions Table */}
                {isLoading ? <Loader2 className="animate-spin mx-auto" /> :
                    <div className=" bg-zinc-900 rounded-2xl p-6 shadow-xl border border-zinc-800/80 mb-4">

                        <div className="flex items-center justify-between">

                            <p className="text-xl font-semibold mb-3 p-1.5 border border-zinc-600/40 rounded-lg  bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent drop-shadow">Total Transactions: {totalTransactions}</p>

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
    )
}

export default FilteredTransactionPage
