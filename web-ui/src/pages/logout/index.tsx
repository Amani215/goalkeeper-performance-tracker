import { useEffect } from 'react'
import { Navigate,useLocation } from 'react-router-dom'


const Logout = () => {
    const location = useLocation()
    useEffect(()=>{
        localStorage.removeItem('loginDTO')
    },[])
  return (
     <Navigate to="/login" state={{ from: location }} replace />
  )
}

export default Logout