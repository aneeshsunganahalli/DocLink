import React from 'react'

export default function Footer() {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] my-10 gap-14 mt-40 text-sm' >
        <div >
          <img className='w-40 mb-5' src="logo.png" alt="" />
          <p className='w-full md:w-2/3 leading-6 text-gray-600'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+1-212-456-7890</li>
            <li>aneeshappid@gmail.com</li>
          </ul>
        </div>
    </div>
        <div>
          <hr/>
          <p className='py-5 text-sm text-center'>Copyright © 2024 AneeshS - All Right Reserved.</p>
        </div>
      </div>
   
  )
}
