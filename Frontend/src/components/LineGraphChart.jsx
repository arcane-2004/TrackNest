import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useMemo, } from 'react';
import { startOfDay, endOfDay, subDays, format } from 'date-fns'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const LineGraphChart = ({ transactions, setIncome, setExpense }) => {

    
    const DATE_RANGE = {
        "7D": { lable: "Last 7 Days", days: 7 },
        "1M": { lable: "Last 1 Month", days: 30 },
        "3M": { lable: "Last 3 Months", days: 90 },
        "6M": { lable: "Last 6 Months", days: 180 },
        ALL: { lable: "All Times", days: null },
    }

    const [dateRange, setDateRange] = useState("1M")

    const filteredRange = useMemo(() => {
        const range = DATE_RANGE[dateRange];
        const now = new Date();

        const startDate = range.days
            ? startOfDay(subDays(now, range.days))
            : startOfDay(new Date(0));

        //filter transaction
        const filtered = transactions.filter(
            (t) => new Date(t.dateTime) >= startDate && new Date(t.dateTime) <= endOfDay(now)
        )

        const grouped = filtered.reduce((acc, transaction) => {
            const date = format(new Date(transaction.dateTime), "MMM dd");

            if (!acc[date]) {
                acc[date] = { date, income: 0, expense: 0 };
            }

            if (transaction.isExpense === false) {
                acc[date].income += transaction.amount;
            } else {
                acc[date].expense += transaction.amount;
            }
            return acc
        }, {})

        return Object.values(grouped).sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        )

    }, [transactions, dateRange])

    const totals = useMemo(() => {
        return filteredRange.reduce((acc, day) => ({
            income: acc.income + day.income,
            expense: acc.expense + day.expense,
        }),
            { income: 0, expense: 0 }
        )
    }, [filteredRange])

    setIncome(totals.income);
    setExpense(totals.expense);


    return (
        <div className="h-[52vh] p-3 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
            <div className='p-3 flex justify-between items-center '>
                <h3>Overview</h3>
                <Select defaultValue={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger
                        id="typeFilter"
                        className="w-[180px] bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-all duration-200 ring-0 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 border-0 shadow-none"
                    >
                        <SelectValue placeholder="Select range" />
                    </SelectTrigger>

                    <SelectContent
                        className="bg-zinc-900  border-0 text-zinc-200 shadow-xl rounded-md"
                    >
                        {Object.entries(DATE_RANGE).map(([key, { lable }]) => {
                            return <SelectItem key={key} value={key}>
                                {lable}
                            </SelectItem>
                        })}

                    </SelectContent>
                </Select>
            </div>
            <div className='w-full h-[42vh]'>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        // style={{ width: '100%', maxWidth: '700px', height: '70%', maxHeight: '70vh', aspectRatio: 1.618 }}

                        data={filteredRange}
                        margin={{
                            top: 15, right: 15, left: 0, bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date"
                            tick={{ fill: "#cfcfcf" }}
                            stroke="rgba(255,255,255,0.2)" 
                            fontSize={13} />

                        <YAxis tick={{ fill: "#cfcfcf" }}
                            stroke="rgba(255,255,255,0.2)" 
                            tickFormatter={(value) => `₹${value}`}
                            fontSize={13} />
                        <Tooltip
                            contentStyle={{
                                background: "rgba(24, 24, 27, 0.9)",
                                borderRadius: "12px",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                color: "#fff",
                                padding: "10px",
                            }}
                            labelStyle={{ color: "#ffa94d" }}
                            cursor={{ stroke: "#ffa94d", strokeWidth: 1 }} />
                        <Legend
                            iconType="circle"
                            wrapperStyle={{ paddingTop: "10px" }} />

                        <Line type="monotone" dataKey="income" name="Income" stroke="#fbbf24" strokeWidth={1}
                            dot={{ r: 5, strokeWidth: 1, stroke: "#fb923c" }}
                            activeDot={{ r: 8, stroke: "#fb923c" }} />

                        <Line type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={1}
                            dot={{ r: 5, strokeWidth: 1, stroke: "#f87171" }}
                            activeDot={{ r: 8, stroke: "#f87171" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

        </div>
    )
}

export default LineGraphChart
