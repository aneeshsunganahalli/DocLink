import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext';

export default function Navbar() {

  const navigate = useNavigate();

  const {aToken, setAToken} = useContext(AdminContext)
  const {dToken, setDToken} = useContext(DoctorContext)

  const logout = () => {
    navigate('/')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center  text-xs'>
        <img className='w-36 sm:w-40 cursor-pointer' src='logo.png' alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 mt-2.5'>{aToken ? 'Admin' : 'Doctor'}</p>
      </div>
      <button className='' onClick={logout}>Logout</button>
    </div>
  )
}
