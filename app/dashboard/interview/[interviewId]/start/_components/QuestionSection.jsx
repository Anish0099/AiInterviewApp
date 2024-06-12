import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionSection({ mockInterviewQuestion, activeQuestionIndex }) {

    const textToSpeech = (text) => {
        if (window.speechSynthesis) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        } else {
            alert('Your browser does not support text to speech')
        }
    }

    return mockInterviewQuestion && (
        <div className='border rounded-lg my-10 p-5'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {mockInterviewQuestion && mockInterviewQuestion.map((question, index) => (
                    <h2 key={index} className={`p-2 border rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex === index ? 'bg-primary text-white' : ''}`}>Question #{index + 1}</h2>
                ))}


            </div>
            <h2 className='my-5 text-md md:text-lg'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>

            <Volume2 onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex].question)} className='cursor-pointer' />

            <div className='border rounded-lg p-5 bg-slate-200 mt-10'>
                <h2 className='flex gap-2 items-center text-primary'>
                    <Lightbulb />
                    <strong>Note:</strong>
                </h2>
                <h2 className='text-sm text-primary my-2'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
            </div>
        </div>
    )
}

export default QuestionSection