'use client'

import React, { useEffect, useState } from 'react'
import { db } from '/utils/db'
import { MockInterview } from '/utils/schema'
import { eq } from 'drizzle-orm'
import QuestionSection from './_components/QuestionSection'
import RecordAnswerSection from './_components/RecordAnswerSection'
import { Button } from '/components/ui/button'
import Link from 'next/link'


function StartInterview({ params }) {
    const [interviewData, setInterviewData] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
    useEffect(() => {
        console.log(params);
        GetInterviewDetails();
    }, [])

    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId))

        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        console.log(jsonMockResp)
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);


    }

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* {Questions} */}
                <QuestionSection activeQuestionIndex={activeQuestionIndex} mockInterviewQuestion={mockInterviewQuestion} />

                {/* {Video Audio recording} */}
                <RecordAnswerSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex} interviewData={interviewData} />
            </div>
            <div className='flex justify-end gap-6'>
                {activeQuestionIndex > 0 && <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>}

                {activeQuestionIndex !== mockInterviewQuestion?.length - 1 && <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>}

                {activeQuestionIndex === mockInterviewQuestion?.length - 1 &&
                    <Link href={'/dashboard/interview/' + interviewData?.mockId + '/feedback'}>
                        <Button>End Interview</Button>
                    </Link>
                }

            </div>
        </div>
    )
}

export default StartInterview