import React from 'react'
import { Button } from '/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function InterviewItemCard({ interview }) {

    const router = useRouter()

    const onStart = () => {
        router.push('/dashboard/interview/' + interview?.mockId)
    }

    const onFeedback = () => {
        router.push('/dashboard/interview/' + interview?.mockId + '/feedback')
    }

    return (
        <div className='border shadow-sm p-3 rounded-lg'>
            <h2 className='text-primary font-bold'>{interview?.jobPosition}</h2>
            <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years of Experience</h2>
            <h2 className='text-xs text-gray-400'>Created At: {interview?.createdAt} </h2>
            <div className='flex justify-between gap-5 mt-2'>

                <Button onClick={onFeedback} size='sm' variant='outline' className='w-full'>Feedback</Button>


                <Button onClick={onStart} className='w-full' size='sm'>Start</Button>
            </div>
        </div>
    )
}

export default InterviewItemCard