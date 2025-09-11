import React from 'react'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import * as Yup from "yup"
import { Form, Formik } from "formik"
// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';

import {
    IconBrandGithub,
    IconBrandGoogle,
    IconBrandOnlyfans,
} from "@tabler/icons-react";

const ForgetPassword = () => {
    const navigate = useNavigate();


    const initialStates = {
        email: '',
    }

    const validtionSchema = Yup.object({
        email: Yup.string().email("Invaild email").required('email is required'),
    })



    const handleSubmit = async (values) => {
        const data = {
            email: values.email
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/forget/password`, data, {
                withCredentials: true
            });
            if (response.status === 200) {
                navigate('/verify/otp')
                toast.success(response.data.message)

            }

        }
        catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }



    };

    return (
        <div className='flex justify-center items-center h-screen bg-gradient-to-br from-[#000000] via-[#323e51] to-[#000000]'>
            <div className='relative flex overflow-hidden h-[auto] w-[30vw] rounded-4xl p-[2px] shadow-2xl  '>

                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#CBF7FF_0%,#0073FF_50%,#CBF7FF_100%)] p-[2px]" />
                <span className="relative inline-flex h-full w-full cursor-pointer rounded-4xl items-center justify-center bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl ">

                    <div className="relative bg-gray-950 mx-auto w-full max-w-md rounded-none p-4 md:rounded-2xl md:p-8">

                        <h2 className="text-xl text-center font-bold text-neutral-800 dark:text-neutral-200">
                            Find Your Account
                        </h2>
                        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">

                        </p>

                        <Formik onSubmit={handleSubmit} validationSchema={validtionSchema} initialValues={initialStates}>
                            {({ handleBlur, handleChange, touched, errors }) =>

                                <Form className="my-8">
                                    <LabelInputContainer className="mb-4">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input

                                            name='email'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            id="email" placeholder=" " type="text"
                                        />

                                        {touched.email && errors.email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                        )}
                                    </LabelInputContainer>


                                    <button
                                        className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] hover:cursor-pointer"

                                        type="submit">
                                        Send OTP &rarr;
                                        <BottomGradient />
                                    </button>
                                    <div
                                        className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

                                    <div className="flex flex-col space-y-4">
                                        <button
                                            className="group/btn shadow-input relative h-10 w-full space-x-2 rounded-md bg-gray-50 px-4 font-medium text-white dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] hover:cursor-pointer"
                                            type="button"
                                            onClick={() => navigate('/Login')}>
                                            Back to Sign in
                                            <BottomGradient />
                                        </button>

                                    </div>
                                </Form>
                            }
                        </Formik>
                    </div>
                </span>
            </div>
        </div>
    )
}

export default ForgetPassword

const BottomGradient = () => {
    return (
        <>
            <span
                className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span
                className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className
}) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};
