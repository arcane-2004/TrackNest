import React from 'react'
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom';
import Countdown from 'react-countdown'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState } from 'react';


const VerifyOTP = () => {

    const navigate = useNavigate();

    const [timerEnd, setTimerEnd] = useState(Date.now() + 2 * 60 * 1000);
    const [isResending, setIsResending] = useState(false);

    const initialStates = {
        otp1: '',
        otp2: '',
        otp3: '',
        otp4: '',
        otp5: '',
        otp6: '',
    }

    const validationSchema = Yup.object({
        otp1: Yup.number().required(''),
        otp2: Yup.number().required(''),
        otp3: Yup.number().required(''),
        otp4: Yup.number().required(''),
        otp5: Yup.number().required(''),
        otp6: Yup.number().required(''),
    })

    const handleSubmit = async (values) => {
        const otp = { otp: values.otp1 + values.otp2 + values.otp3 + values.otp4 + values.otp5 + values.otp6 };
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/verify/otp`, otp, { withCredentials: true });

            if (response.status === 200) {
                toast.success(response.data.message || "OTP verified successfully");
                navigate('/update/password');
            }
        }
        catch (errors) {
            toast.error(errors.response?.data?.message || "OTP verification failed");
        }


    }

    const handleResend = async () => {
        setIsResending(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/forget/password`, {}, { withCredentials: true });
            if (response.status === 200) {
                toast.success(response.data.message || "OTP resent successfully");
                setTimerEnd(Date.now() + 2 * 60 * 1000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        setIsResending(false);
    }
    // function for managing the input of otp
    const inputChange = (value, setFieldValue, index, item) => {
        setFieldValue(item, value);
        if (index >= 0 && index < 6) {
            const element = document.getElementById(`otp${index + 2}`);
            if (element) {
                element.focus();
            }
            console.log(element)
        }
    }

    const optArrray = ['otp1', 'otp2', 'otp3', 'otp4', 'otp5', 'otp6'];

    return (
        <div className='flex justify-center items-center bg-black h-screen'>


            <div
                className="bg-[#242424] mx-auto w-full max-w-md rounded-none p-4 md:rounded-2xl md:p-8">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
                    Verify OTP
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 mb-2">
                    Enter the 6-digit OTP sent to your registered Email
                </p>
                <Formik onSubmit={handleSubmit} initialValues={initialStates} validationSchema={validationSchema}>
                    {({ handleBlur, touched, errors, values, setFieldValue }) =>
                        <Form>
                            <LabelInputContainer className="mb-4 flex flex-row gap-1 justify-center ">

                                {optArrray.map((item, index) =>
                                    <div key={item}>
                                        <Input
                                            className="text-center"
                                            type="text"
                                            name={item}
                                            value={values[item] ?? ""}
                                            id={item}
                                            onBlur={handleBlur}
                                            maxLength={1}
                                            pattern="[0-9]+"
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^0-9]/g, "")
                                                inputChange(value, setFieldValue, index, item)
                                            }}
                                            inputMode="numeric" />

                                        {touched[item] && errors[item] && (
                                            <p>errors[item]</p>
                                        )}
                                    </div>
                                )}
                            </LabelInputContainer>
                            <button
                                className="group/btn shadow-input relative h-10 w-full space-x-2 rounded-md bg-gray-50 px-4 font-medium text-white dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] hover:cursor-pointer"
                                type="submit"
                                disabled={Object.values(values).some((value) => value === "")}>
                                Verify OTP
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

                            <div className='text-white my-2'>
                                <Countdown
                                    key={timerEnd}
                                    renderer={({ minutes, seconds, completed }) => {
                                        if (completed) {
                                            return <button className='hover:cursor-pointer'
                                                onClick={handleResend}
                                                disabled={isResending}
                                            >
                                                {isResending ? "Resending..." : "Resend"}
                                            </button>
                                        }
                                        else {
                                            return (
                                                <span>
                                                    {`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
                                                </span>
                                            )
                                        }
                                    }}
                                    date={timerEnd} />
                            </div>

                        </Form>}
                </Formik>
            </div>
        </div>
    )
}

export default VerifyOTP

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