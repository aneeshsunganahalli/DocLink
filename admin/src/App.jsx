import React, { useContext } from 'react';
import Login from './pages/Login';
import { ToastContainer} from 'react-toastify';
import { AdminContext } from './context/AdminContext'

export default function App() {

  const {aToken} = useContext(AdminContext)

  return  aToken ? (
    <div>
      <ToastContainer />
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}
