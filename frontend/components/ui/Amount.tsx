import { formatCurrency } from '@/src/utils'
import React from 'react'

type Props = {
    label: string,
    amount: number
}

export default function Amount({label, amount}: Props) {
  return (
      <p className='text-2xl font-bold'>{label}: <span className='text-amber-500'>{formatCurrency(amount)}</span></p>
  )
}
