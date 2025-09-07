"use client";
import React from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { Form, Formik } from "formik"
import * as Yup from "yup"
import { useState } from "react";

export default function SignupFormDemo() {

  const [visibility, setVisibility] = useState(false)



  const navigate = useNavigate();

  const visibilityHandle = () => {
    setVisibility(!visibility)
  }

  const initialStates = {
    name: '',
    email: '',
    password: ''
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('name is required'),
    email: Yup.string().email('invalid email').required('email is required'),
    password: Yup.string().required('password is required')
  })

  const handleSubmit = async (values) => {

    const userData = {
      name: values.name,
      email: values.email,
      password: values.password
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, userData, { withCredentials: true })

      if (response.status === 201) {
        const data = response.data
        navigate('/dashboard');
        console.log(data);

      }

    } catch (errors) {

      if (errors.response?.status === 401) {
        toast.error(errors.response?.data?.errors?.[0]?.msg || "Invalid credentials")
      }
      else {
        toast.error(errors.response?.data?.message || "Login failed");
      }

    }


  };


  const handleGoogleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/user/auth/google`
  }



  return (
    <div
      className="mx-auto w-full max-w-md rounded-none  p-4 md:rounded-2xl md:p-8 ">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to Aceternity
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Login to aceternity if you can because we don&apos;t have a login flow
        yet
      </p>

      <Formik onSubmit={handleSubmit} initialValues={initialStates} validationSchema={validationSchema}>

        {({ handleBlur, handleChange, touched, errors }) =>

          <Form className="my-8">
            <div
              className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <LabelInputContainer>
                <Label htmlFor="firstname">First name</Label>
                <Input id="name"
                  name="name"
                  placeholder=" "
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.name && errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name} </p>
                )}

              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="lastname">Last name</Label>
                <Input id="lastname" placeholder=" " type="text" />
              </LabelInputContainer>
            </div>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email"
                name="email"
                placeholder=" "
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {touched.email && errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email} </p>
              )}
            </LabelInputContainer>

            <LabelInputContainer className="mb-4 relative">
              <Label htmlFor="password">Password</Label>
              <Input id="password"
                name="password"
                placeholder=" "
                type={visibility ? "text" : "password"}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <button type="button"
                className="text-white absolute right-3 top-7.5 hover:cursor-pointer"
                onClick={visibilityHandle}>
                {visibility ? <i className="ri-eye-off-line"></i> : <i className="ri-eye-line"></i>}
              </button>

              {touched.password && errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password} </p>
              )}
            </LabelInputContainer>


            <button
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] hover:cursor-pointer"
              type="submit">
              Sign up &rarr;
              <BottomGradient />
            </button>


            <div
              className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

            <div className="flex flex-col space-y-4">

              <button
                className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] hover:cursor-pointer"
                type="button"
                onClick={handleGoogleSignIn}>
                <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Google
                </span>
                <BottomGradient />
              </button>

            </div>
          </Form>
        }
      </Formik>
    </div>
  );
}

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
