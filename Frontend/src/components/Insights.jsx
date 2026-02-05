import React from 'react'
import { useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountContext } from '../context/AccountContext';

const Insights = () => {

    const { selectedAccountId, loadingAccount } = useContext(AccountContext);
    console.log('acc', selectedAccountId)

    const fetchBudgetInsights = async () => {
        await axios.get(`${import.meta.env.VITE_BASE_URL}/analysis/insights/budgets/${selectedAccountId}`,
            {
                withCredentials: true
            }
        )

    }
     
    useEffect(() => {
        if(selectedAccountId && !loadingAccount){
            fetchBudgetInsights()
        }
    },[selectedAccountId, loadingAccount])

    return (
        <div>

        </div>
    )
}

export default Insights
