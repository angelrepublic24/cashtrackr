import React from 'react'

const SuccessMessage = ({children}: {children: React.ReactNode}) => {
  return (
    <p className='text-center my-4 bg-amber-500 text-white text-sm font-bold p-3'>
      {children}
    </p>
  )
}

export default SuccessMessage
