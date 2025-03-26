import React from 'react'

export default function ErrorMessage({children}: {children: React.ReactNode}) {
  return (
    <p className='text-center my-4 bg-red-600 text-white text-sm font-bold p-3'>
      {children}
    </p>
  )
}
