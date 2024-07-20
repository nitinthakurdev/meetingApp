// @ts-nocheck
"use client"
import { useGetCalls } from '@/hooks/useGetCalls'
import { Call, CallRecording } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import MeetingCard from './meetingCard'
import { link } from 'fs'
import Loader from './Loader'
import { useToast } from './use-toast'

const CallList = ({type}:{type:'ended' | 'upcoming' | 'recording'}) => {
  const { endedCalls, UpcomingCalls, callRecordings, isLoading } = useGetCalls()
  const router = useRouter()
  const [recording ,setRecordings] = useState<CallRecording[]>([])
  const {toast} = useToast()

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case 'recording':
        return recording;
      case 'upcoming':
        return UpcomingCalls
      default:
        return []
    }
  }

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case 'recording':
        return "No Recordings";
      case 'upcoming':
        return "No Upcoming Calls"
      default:
        return ''
    }
  }

  useEffect(() => {
    const fetchRecordings = async () => {
      try{

        const callData = await Promise.all(
          callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
        );
  
        console.log("that is call data",callData)
        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);
  
        setRecordings(recordings);
      }catch(err){
        console.log(err)
      }
    };

    if (type === 'recording') {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  const calls = getCalls()
  const callsMessage = getNoCallsMessage()

  if(isLoading) return <Loader/>

  return (
    <div className='grid gird-cols-1 gap-5 xl:grid-cols-2' >
      {calls && calls.length > 0 ? calls.map((meeting : Call | CallRecording) => {
        return <MeetingCard
          key={(meeting as Call).id}
          icon={
            type === 'ended' ? '/icons/previous.svg' : type === 'upcoming' ? '/icons/upcoming.svg' : '/icons/recording.svg'
          }
          title={(meeting as Call).state?.custom.description?.substring(0,25) || meeting.filename?.substring(0,20) || 'Personal Meeting'}
          date={meeting.state?.startsAt?.toLocaleString()||meeting.start_time?.toLocaleString()}
          isPreviousMeeting={type === 'ended' }
          buttonIcon1={type === 'recording' ? '/icons/play.svg' : undefined}
          handleClick={type === 'recording'  ? ()=>{router.push(`${meeting.url}`)} : ()=>{router.push(`/meeting/${meeting.id}`)}}
          link={type === 'recording' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
          buttonText={type === 'recording' ? 'Play' : "Start"}
         />
      }) : <h1>{callsMessage}</h1>}
    </div>
  )
}

export default CallList