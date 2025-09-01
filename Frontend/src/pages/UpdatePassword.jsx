import React from 'react'
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Form, Formik, validateYupSchema } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {

    const initialStates = {
        password: ""
    }

    const validationSchema = Yup.object({
        password: Yup.string().required('password is required')
    })

    const handleSubmit = (value) => {
        console.log(value);

    }

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
                    {({ handleBlur, handleChange, touched, errors }) =>
                        <Form>
                            <LabelInputContainer>
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

                        </Form>
                    }
                </Formik>
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