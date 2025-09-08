import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Super = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/get/access`, {
                    withCredentials: true
                })
                console.log(response.data);
                if (response.status === 200) {
                    setIsAuthenticated(true)
                }
            }
            catch(error){
                setIsAuthenticated(false)
                console.log(error);
                
            }
            finally{
                setLoading(false)
            }
            

        }
        checkAuth()
    }, [])

    if (loading) {
        return <p>Checking authentication...</p>  // or a spinner
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    else {
        return <Outlet />
    }


}

export default Super

