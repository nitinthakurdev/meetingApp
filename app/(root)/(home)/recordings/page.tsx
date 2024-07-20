import CallList from '@/components/ui/CallList'
import React from 'react'

const Recording = () => {
  return (
    <section className=' flex size-full flex-col gap-10 text-white'>
      <h1 className='text-3xl font-bold ' >Recording</h1>
      <CallList type="recording" />
    </section>
  )
}

export default Recording
