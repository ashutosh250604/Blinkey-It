import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { useGlobalContext } from '../provider/GlobalProvider'
import toast from 'react-hot-toast'

const Success = () => {
  const location = useLocation()
  const { fetchCartItem, fetchOrder } = useGlobalContext()
  const [processing, setProcessing] = useState(false)
    
  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = localStorage.getItem('stripeSessionId')
      
      if(sessionId && !processing){
        setProcessing(true)
        try {
          const response = await Axios({
            ...SummaryApi.verifyPayment,
            data : { sessionId }
          })

          if(response.data.success){
            // Clear the session ID
            localStorage.removeItem('stripeSessionId')
            
            // Refresh cart and orders
            if(fetchCartItem){
              fetchCartItem()
            }
            if(fetchOrder){
              fetchOrder()
            }
          }
        } catch (error) {
          // Error handled silently
        } finally {
          setProcessing(false)
        }
      }
    }

    verifyPayment()
  }, [])

  return (
    <div className='m-2 w-full max-w-md bg-green-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
        <p className='text-green-800 font-bold text-lg text-center'>
          {Boolean(location?.state?.text) ? location?.state?.text : "Payment" } Successfully
        </p>
        {processing && <p className='text-sm text-green-700'>Processing your order...</p>}
        <Link to="/" className="border border-green-900 text-green-900 hover:bg-green-900 hover:text-white transition-all px-4 py-1">Go To Home</Link>
    </div>
  )
}

export default Success
