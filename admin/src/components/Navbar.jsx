import React, { useContext } from 'react'
import { assets } from '../assets/assets_admin/assets'
import { AdminContext } from '../context/AdminContext'

export default function Navbar() {

  const {aToken, setAToken} = useContext(AdminContext)

  const logout = () => {
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center  text-xs'>
        <img className='w-36 sm:w-40 cursor-pointer' src='logo.png' alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 mt-2.5'>{aToken ? 'Admin' : 'Doctor'}</p>
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
