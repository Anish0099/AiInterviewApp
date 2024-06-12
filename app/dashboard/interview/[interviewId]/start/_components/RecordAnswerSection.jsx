'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { Button } from '/components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from "/utils/GeminiAIModal"
import { useUser } from '@clerk/nextjs'
import { db } from '/utils/db'
import { UserAnswer } from '/utils/schema'
import moment from 'moment';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {

    const [userAnswer, setUserAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useUser();

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        results.map((result) => {
            setUserAnswer(prevAns => prevAns + result.transcript)
        })

    }, [results])

    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {

            UpdateUserAnswer();
        }
    }, [userAnswer])

    const StartStopRecording = async () => {
        if (isRecording) {


            stopSpeechToText()



        } else {
            startSpeechToText()
        }
    }

    const UpdateUserAnswer = async () => {
        console.log(userAnswer)
        setLoading(true)
        const feedbackPrompt = "Question:" + mockInterviewQuestion[activeQuestionIndex].question + " Answer:" + userAnswer + "Depends on question and user answer for given interview question" + "please give us rating for answer and feedback as area of improvement if any " + "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field"

        const result = await chatSession.sendMessage(feedbackPrompt);

        const mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '')
        console.log(mockJsonResp)
        const jsonFeedbackResp = JSON.parse(mockJsonResp)

        const resp = await db.insert(UserAnswer).values({
            mockIdRef: interviewData?.mockId,
            question: mockInterviewQuestion[activeQuestionIndex]?.question,
            correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
            userAns: userAnswer,
            feedback: jsonFeedbackResp?.feedback,
            rating: jsonFeedbackResp?.rating,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-yyyy')
        })

        if (resp) {
            toast.success('Your answer has been saved')
            setUserAnswer("");
            setResults([])
        }
        setResults([])

        setLoading(false)

    }

    return (
        <div className='flex items-center flex-col justify-center'>
            <div className='flex flex-col items-center bg-slate-200 justify-center mt-20 rounded-lg p-5'>
                <Image className='absolute' src={'/webcam.png'} alt='webcam_icon' width={200} height={200} />
                <Webcam mirrored={true} style={{
                    height: 300,
                    width: '100%',
                    zIndex: 10
                }} />
            </div>
            <Button disabled={loading} onClick={StartStopRecording} className='my-10' variant='outline'>
                {isRecording ? <h2 className='flex animate-pulse gap-2 items-center'><StopCircle />'Stop Recording'</h2> : <h2 className='flex gap-2 items-center'><Mic />'Record Answer'</h2>}
            </Button>


        </div>
    )
}

export default RecordAnswerSection