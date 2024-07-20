"use client"

import React, { useState } from 'react'
import HomeCards from "./HomeCards"
import { useRouter } from 'next/navigation'
import MeetingModel from './MeetingModel'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from './textarea'
import ReactDatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css";
import { Input } from './input'


const MeetingTypeList = () => {
  const router = useRouter()
  const [meeting, setMeeting] = useState<"isScheduleMeeting" | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
  const { user } = useUser()
  const client = useStreamVideoClient()
  const [value, setValue] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  })
  const [callDetails, setCallDetails] = useState<Call>()
  const { toast } = useToast()

  const createMeeting = async () => {
    
    if (!client || !user) return;
    try {
      if (!value.dateTime) {
        toast({ title: "Please select a date and time" })
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id)
      if (!call) throw new Error("Failed to Create call");
      const startsAt = value.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = value.description || 'Instant Meeting';
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description
          }
        }
      })
      setCallDetails(call)
      if (!value.description) {
        router.push(`/meeting/${call.id}`)
      }
      toast({ title: "Meeting Created " })
    } catch (err) {
      console.log(err)
      toast({ title: "Fail to Create Meeting" })
    }
  }

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4' >
      <HomeCards img="/icons/add-meeting.svg" title="New Metting" desc="Start an instant Meeting" handleClick={() => setMeeting("isInstantMeeting")} className="bg-orange-1" />
      <HomeCards img="/icons/schedule.svg" title="Schedule Metting" desc="Plan your metting " handleClick={() => setMeeting("isScheduleMeeting")} className="bg-blue-1" />
      <HomeCards img="/icons/recording.svg" title="View Recordings" desc="Check out your recordings" handleClick={() => router.push('/recordings')} className="bg-purple-1" />
      <HomeCards img="/icons/joinmeeting.svg" title="Join Meeting" desc="via invitation link" handleClick={() => setMeeting("isJoiningMeeting")} className="bg-yellow-1" />
      {!callDetails ? (<MeetingModel isOpen={meeting === 'isScheduleMeeting'} onClose={() => setMeeting(undefined)} title="Create Meeting" handleClick={createMeeting} >
        <div className=' flex flex-col gap-2.5' >
          <label className='text-base text-normal leading-[22px] text-sky-2' >Add a description</label>
          <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0' onChange={(e)=>{setValue({...value,description:e.target.value})}} />
        </div>
        <div className='flex w-full flex-col gap-2.5' >
          <label className='text-base text-normal leading-[22px] text-sky-2' >Select Date and Time</label>
          <ReactDatePicker selected={value.dateTime} onChange={(date)=>{setValue({...value,dateTime:date!})}} showTimeSelect timeFormat='HH:mm' timeIntervals={15} timeCaption='time' dateFormat="MMMM d, yyyy h:mm aa" className='w-full rounded bg-dark-3 p-2 focus:outline-none' />
        </div>
      </MeetingModel>) : (<MeetingModel isOpen={meeting === 'isScheduleMeeting'} onClose={() => setMeeting(undefined)} title="Meeting Created" className="text-center" buttonText="Copy meeting Link" handleClick={()=>{
        navigator.clipboard.writeText(meetingLink)
        toast({title:"Link Copyed"})
        }} image='/icons/checked.svg' buttonIcon='/icons/copy.svg' />)}
      <MeetingModel isOpen={meeting === 'isInstantMeeting'} onClose={() => setMeeting(undefined)} title="start an instant metting" className="text-center" buttonText="Start Meeting" handleClick={createMeeting} />

      <MeetingModel isOpen={meeting === 'isJoiningMeeting'} onClose={() => setMeeting(undefined)} title="Type link here" className="text-center" buttonText="Join Meeting" handleClick={()=>{router.push(value.link)}} >
        <Input className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0' onChange={(e)=>{setValue({...value,link:e.target.value})}} />
      </MeetingModel>
    </section>
  )
}

export default MeetingTypeList