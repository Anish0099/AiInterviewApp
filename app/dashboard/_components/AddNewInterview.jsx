'use client'

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "/components/ui/dialog"
import { useState } from 'react'
import { Button } from '/components/ui/button'
import { Input } from '/components/ui/input'
import { Textarea } from '/components/ui/textarea'
import { chatSession } from "/utils/GeminiAIModal"
import { LoaderCircle } from 'lucide-react'
import { db } from '/utils/db'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment';
import { MockInterview } from '/utils/schema'
import { useRouter } from 'next/navigation'




function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false)
    const [jobPosition, setJobPosition] = useState();
    const [jobDescription, setJobDescription] = useState();
    const [jobExperience, setJobExperience] = useState();
    const [loading, setLoading] = useState(false)
    const [jsonResponse, setJsonResponse] = useState([])
    const { user } = useUser();
    const router = useRouter();

    const onSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        console.log(jobPosition, jobDescription, jobExperience);

        const InputPrompt = "Job Position:" + jobPosition + ",Job Description: " + jobDescription + ",years of experience: " + jobExperience + ", Depends on this information please give me " + process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT + " interview questions with answered in JSON format, Give question and answered as field in JSON"

        const result = await chatSession.sendMessage(InputPrompt);
        const MockJsonResponse = (result.response.text()).replace('```json', '').replace('```', '')

        console.log(JSON.parse(MockJsonResponse));
        setJsonResponse(MockJsonResponse);

        if (MockJsonResponse) {

            const resp = await db.insert(MockInterview).values({
                mockId: uuidv4(),
                jsonMockResp: MockJsonResponse,
                jobPosition: jobPosition,
                jobDesc: jobDescription,
                jobExperience: jobExperience,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-yyyy')
            }).returning({ mockId: MockInterview.mockId }).execute();

            console.log("inserted id:", resp)
            if (resp) {
                setOpenDialog(false);
                router.push('/dashboard/interview/' + resp[0]?.mockId)
            }
        } else {
            console.log("Error");
        }
        setLoading(false)
    }
    return (
        <div>
            <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all' onClick={() => setOpenDialog(true)}>
                <h2 className='font-bold text-lg text-center'>+ Add New </h2>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>

                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle className=' text-2xl'>Tells us more about your job interviewing</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>

                                <div>
                                    <h2>Add details about your job position /role, Job description and years of experience</h2>
                                    <div className='mt-7 my-3'>
                                        <label >Job Role/Job Position</label>
                                        <Input
                                            onChange={(e) => setJobPosition(e.target.value)} required placeholder="Ex. Web Developer" />
                                    </div>
                                    <div className='mt-7 my-3'>
                                        <label >Job Description/ Tech Stack (In short)</label>
                                        <Textarea onChange={(e) => setJobDescription(e.target.value)} required placeholder="Ex. React, Node, Postgres, MongoDB, etc." />
                                    </div>
                                    <div className='mt-7 my-3'>
                                        <label >Years of Experience</label>
                                        <Input onChange={(e) => setJobExperience(e.target.value)} required
                                            max="50"
                                            type="number" placeholder="Ex.  5" />
                                    </div>
                                </div>
                                <div className='flex gap-5 justify-end'>
                                    <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                    <Button disabled={loading}>
                                        {loading ? <><LoaderCircle className='w-5 h-5 animate-spin' />'Generating from AI'</> : 'Start Interview'}
                                    </Button>
                                </div>
                            </form>


                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default AddNewInterview