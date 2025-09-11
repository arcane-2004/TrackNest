import React from 'react'
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const UpdatePassword = () => {

    const navigate = useNavigate();

    const initialStates = {
        password: ""
    }

    const validationSchema = Yup.object({
        password: Yup.string().required('password is required')
    })

    const handleSubmit = async (value) => {

        const data = {
            password: value.password
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/update/password`, data, { withCredentials: true })

            if (response.status === 200) {
                toast.success(response.data.message);
                navigate('/Login')
            }

        }
        catch (error) {
            toast.error(error.response?.data?.message);
        }

    }

    return (
        <div className='flex justify-center items-center bg-gradient-to-br from-[#000000] via-[#323e51] to-[#000000] h-screen'>

            <div className='relative flex overflow-hidden h-[auto] w-[30vw] rounded-4xl p-[2px] shadow-2xl  '>

                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#CBF7FF_0%,#0073FF_50%,#CBF7FF_100%)] p-[2px]" />
                <span className="relative inline-flex h-full w-full cursor-pointer rounded-4xl items-center justify-center bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl ">


                    <div
                        className="bg-gray-950 mx-auto w-full max-w-md rounded-none p-4 md:rounded-2xl md:p-8">


                        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
                            Update Password
                        </h2>
                        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 mb-2">
                            Enter your new password
                        </p>
                        <Formik onSubmit={handleSubmit} initialValues={initialStates} validationSchema={validationSchema}>
                            {({ handleBlur, handleChange, touched, errors }) =>
                                <Form>
                                    <LabelInputContainer className={"mb-4"}>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            className={cn("border", {
                                                "border-red-500": touched.password && errors.password
                                            })}
                                        />
                                        {touched.password && errors.password && (
                                            <div className="text-red-500">{errors.password}</div>
                                        )}
                                    </LabelInputContainer>
                                    <button
                                        className="group/btn shadow-input relative h-10 w-full space-x-2 rounded-md bg-gray-50 px-4 font-medium text-white dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] hover:cursor-pointer"
                                        type="submit"
                                    // disabled={Object.values(values).some((value) => value === "")}
                                    >
                                        Update Password
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

export default UpdatePassword

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