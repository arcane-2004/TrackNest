"use client";
import React from "react";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import * as Yup from "yup"
import { Form, Formik } from "formik"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";

export default function SignupFormDemo() {

  const navigate = useNavigate();

  const [visibility, setVisibility] = useState(false);

  const visibilityHandle = () => {
    setVisibility(!visibility)
  }

  const initialStates = {
    email: '',
    password: ''
  }

  const validtionSchema = Yup.object({
    email: Yup.string().email("Invaild email").required('email is required'),
    password: Yup.string().required('password is requried')
  })



  const handleSubmit = async (values) => {

    const userData = {
      email: values.email,
      password: values.password
    }
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, userData, {
        withCredentials: true
      })
      if (response.status === 201) {
        // const { accessToken, user } = response.data;
        

        navigate("/dashboard");
      }
    } catch (errors) {
      if (errors.response?.status === 401) {
        toast.error(errors.response?.data?.errors?.[0]?.msg || "Invalid credentials")
      }
      else {
        toast.error(errors.response?.data?.message || "Login failed");
      }
      console.log(errors);
      
    }


  };

  const handleGoogleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/user/auth/google`
  }


  return (
    <div
      className=" mx-auto w-full max-w-md rounded-none p-4 md:rounded-2xl md:p-8">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Login to TrackNest
      </h2>
     

      <Formik onSubmit={handleSubmit} validationSchema={validtionSchema} initialValues={initialStates}>
        {({ handleBlur, handleChange, touched, errors }) =>

          <Form className="my-8">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input

                name='email'
                onChange={handleChange}
                onBlur={handleBlur}
                className="bg-white/5 border-1 border-white/20"
                id="email" placeholder=" " type="text"
              />

              {touched.email && errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}

            </LabelInputContainer>

            <LabelInputContainer className="mb-4 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder=" "
                type={visibility ? "text" : "password"}
                onChange={handleChange}
                onBlur={handleBlur}
                className="bg-white/5 border-1 border-white/20"
              />

              <button type="button"
                onClick={visibilityHandle}
                className="absolute right-3 top-7.5 text-white hover:cursor-pointer">
                {visibility ? <i className="ri-eye-off-line"></i> : <i className="ri-eye-line"></i>}
              </button>

              {touched.password && errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}

            </LabelInputContainer>


            <button
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] hover:cursor-pointer"
              type="submit">
              Sign in &rarr;
              <BottomGradient />
            </button>
            

            <button className="text-[#A7ACB4] font-medium text-sm mt-1.5 hover:cursor-pointer"
              onClick={() => navigate('/forget/password')}
              type="text" >
              Forget password?
            </button>

            <div
              className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

            <div className="flex flex-col space-y-4">
              <button
                className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] hover:cursor-pointer"
                type="submit"
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
        className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
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
