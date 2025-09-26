import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const AccountViewPage = () => {

    const {id }= useParams() 

    const [transactions, setTransactions] = useState([]);
    
    useEffect(() => {
      const fetchAccountTransactions = async () => {
        
        try{
            
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/transaction/get/account-transaction/${id}`, {
                withCredentials: true
            })

            console.log(response.data)
            setTransactions(response.data.transactions)
            console.log(transactions);
            
        }catch(error){
            console.log(error.response?.data || 'Something went wrong')
        }
      }

        fetchAccountTransactions()
    
    }, [])
    

  return (
    <div>
     

    </div>
  )
}

export default AccountViewPage
