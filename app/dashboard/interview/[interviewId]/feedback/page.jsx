'use client'

import React, { useEffect, useState } from 'react'
import { db } from '/utils/db'
import { UserAnswer } from '/utils/schema'
import { eq } from 'drizzle-orm'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '/components/ui/button'




function Feedback({ params }) {

    const [feedbackList, setFeedbackList] = useState();
    const [totalRatingOfUser, setTotalRatingOFUser] = useState(0);

    const router = useRouter()

    useEffect(() => {
        GetFeedback();
        overallRating()

    }, [])
    const GetFeedback = async () => {
        const result = await db.select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, params.interviewId))
            .orderBy(UserAnswer.id);

        console.log(result)
        setFeedbackList(result);
    }

    const overallRating = async () => {
        const totalRating = await db.select().from(UserAnswer).where(eq(UserAnswer.mockIdRef, params.interviewId))


        let totalRatings = 0;
        totalRating.forEach((rating) => {
            totalRatings += parseInt(rating.rating, 10);
        });

        setTotalRatingOFUser(totalRatings);

        console.log(totalRatings);
    }
    return (
        <div className="p-10">


            {feedbackList?.length === 0 ?
                <h2 className='text-xl font-bold text-gray-500'>No Interview Feedback</h2> : <>
                    <h2 className='text-3xl font-bold text-slate-700'>Congratulations🚀</h2>
                    <h2 className='font-bold text-2xl'> Here is your interview Feedback</h2>

                    <h2 className='text-lg my-3 text-primary '> Your overall interview rating is {totalRatingOfUser}/25<strong></strong></h2>
                    <h2 className='text-sm text-gray-500'>Find below interview question with correct answer and your answer.Also feedback fro improvement .</h2>
                    {feedbackList && feedbackList.map((item, index) => (
                        <Collapsible key={index} className="mt-7">
                            <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full'>{item.question}<ChevronsUpDown className='h-5 w-5' /></CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong>{item.rating}</h2>
                                    <h2 className='p-2 border rounded-lg bg-red-50 text-red-900  text-sm '><strong>Your Answer: </strong>{item.userAns}</h2>
                                    <h2 className='p-2 border rounded-lg bg-green-50 text-green-900  text-sm '><strong>Correct Answer: </strong>{item.correctAns}</h2>
                                    <h2 className='p-2 border rounded-lg bg-blue-50 text-primary  text-sm '><strong>Feedback : </strong>{item.feedback}</h2>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                    ))}
                </>}

            <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
        </div>
    )
}

export default Feedback