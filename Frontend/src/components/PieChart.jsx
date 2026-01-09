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

const PieChart = ({ setCategoryData }) => {
    const { selectedAccountId, loadingAccount } = useContext(AccountContext);

    const [data, setData] = useState({});
    const [range, setRange] = useState('Monthly')

    const fetchCategorySummary = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/analysis/category-summary/${selectedAccountId}`,
                { withCredentials: true }
            )
            setData(response.data.data);
            console.log('pie data', response.data)
        }
        catch (error) {
            console.log(error.response?.data?.message || "some")
        }
    }

    useEffect(() => {
        if (!loadingAccount && selectedAccountId) {
            fetchCategorySummary();
        }

    }, [loadingAccount, selectedAccountId])

    useEffect( () => {
        setCategoryData(data[0]?.[range] || []);
    },[data, range])

    return (
        <div className='h-100' >
            <div>
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
            </div>
            
            <ResponsivePie
                data={data[0]?.[range] || []}
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

                legends={[
                    {
                        anchor: 'right',
                        direction: 'column',
                        translateX: -50,
                        itemWidth: 100,
                        itemHeight: 40,
                        symbolSize: 25,
                        symbolShape: 'circle',
                        itemTextColor: '#ddd',

                    }
                ]}

            />
        </div>

    )
}

export default PieChart
