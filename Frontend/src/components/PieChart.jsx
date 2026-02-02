import React from 'react'
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AccountContext } from '../context/AccountContext';
import { ResponsivePie } from '@nivo/pie';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const PieChart = ({ data, setData, range, setRange, year, setYear, month, setMonth, setDate }) => {
    const { selectedAccountId, loadingAccount } = useContext(AccountContext);

    const now = new Date();

    
    const [day, setDay] = useState(now.getDate());

    const fetchCategorySummary = async () => {
        const date =
            range === "Daily"
                ? `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                : undefined;
        setDate(date)
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/analysis/category-summary/${selectedAccountId}`,
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

            setData(response.data.summaryData);
            // setCategoryData(response.data.summaryData)

        } catch (error) {
            console.error(
                error.response?.data?.message || "Failed to fetch category summary"
            );
        }
    };


    useEffect(() => {
        if (!loadingAccount && selectedAccountId) {
            fetchCategorySummary();
        }

    }, [loadingAccount, selectedAccountId, range, year, month, day])

    // useEffect(() => {
    //     setCategoryData(data[0]?.[range] || []);
    // }, [data, range])

    // ----------- Years array -----------
    const years = Array.from(
        { length: 5 },
        (_, i) => new Date().getFullYear() - i
    );

    // ---------------- month array -----------------
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // ---------------------- days based on selected month --------------------
    const daysInMonth = new Date(year, month, 0).getDate();

    return (
        <div className='h-100' >
            <div className='flex items-center justify-between'>
                {/* ----------------- date Range ----------------------- */}
                <Select onValueChange={(value) => setRange(value)}>
                    <SelectTrigger className="w-[180px] mb-4 border border-zinc-600">
                        <SelectValue placeholder={range} />
                        <SelectContent className='bg-zinc-700/50 text-white'>
                            <SelectItem value="Daily">Daily</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Yearly">Yearly</SelectItem>
                            <SelectItem value="All">All</SelectItem>
                        </SelectContent>
                    </SelectTrigger>
                </Select>

                <div className='flex items-center gap-3'>
                    {/* ---------------------- Year selection ----------------------- */}
                    <Select onValueChange={(value) => setYear(Number(value))}>
                        <SelectTrigger className="w-[120px] mb-4 border border-zinc-600">
                            <SelectValue placeholder={year} />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-700/50 text-white">
                            {years.map(y => (
                                <SelectItem key={y} value={String(y)}>
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* ---------------------- Month selection ---------------------- */}
                    {(range === "Monthly" || range === "Daily") && (
                        <Select onValueChange={(value) => setMonth(Number(value))}>
                            <SelectTrigger className="w-[160px] mb-4 border border-zinc-600">
                                <SelectValue placeholder={months[month - 1]} />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-700/50 text-white">
                                {months.map((m, i) => (
                                    <SelectItem key={i} value={String(i + 1)}>
                                        {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {/* ------------------------------ Day selection ----------------------------- */}
                {range === "Daily" && (
                    <Select onValueChange={(v) => setDay(Number(v))}>
                        <SelectTrigger className="w-[120px] mb-4 border border-zinc-600">
                            <SelectValue placeholder={day} />
                        </SelectTrigger>

                        <SelectContent className="bg-zinc-700/50 text-white">
                            {[...Array(daysInMonth)].map((_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1)}>
                                    {i + 1}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

            </div>
            <ResponsivePie
                data={data|| []}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.6}
                padAngle={1}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ scheme: 'nivo' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                enableArcLabels={true}
                arcLabel={d => `${d.data.percentage.toFixed(2)}%`}  // custom
                enableArcLinkLabels={true}
                // arcLinkLabel="lable"
                arcLinkLabel={d => `${d.label} (₹${d.value.toLocaleString()})`}

                arcLabelsSkipAngle={10}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#ddd"
                arcLabelsTextColor="#333333"
                arcLinkLabelsThickness={1}
                arcLinkLabelsColor={{ from: 'color' }}
                tooltip={({ datum }) => (
                    <div
                        style={{
                            background: '#111',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            color: '#fff'
                        }}
                    >
                        <strong>{datum.label}</strong>
                        <br />
                        ₹{datum.value.toLocaleString()}
                    </div>
                )}
            />
        </div>

    )
}

export default PieChart
