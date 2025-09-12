"use client";
import React from "react";
import { SparklesCore } from "../components/ui/sparkles";
import HoverBorderGradient from "../components/ui/hover-border-gradient";
import { useNavigate } from "react-router-dom";

export default function SparklesPreview() {

    const navigate = useNavigate();

    return (
        <div
            className="h-screen w-full bg-black flex flex-col items-center  overflow-hidden p-10">
            <div>


                <h1
                    className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
                    TrackNest
                </h1>
                <div className="w-[40rem] h-40 relative">
                    {/* Gradients */}
                    <div
                        className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
                    <div
                        className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                    <div
                        className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
                    <div
                        className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

                    {/* Core component */}
                    <SparklesCore
                        background="transparent"
                        minSize={0.4}
                        maxSize={1}
                        particleDensity={1200}
                        className="w-full h-full"
                        particleColor="#FFFFFF" />

                    {/* Radial Gradient to prevent sharp edges */}
                    <div
                        className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
                </div>
            </div>

            <div className="flex justify-center h-screen items-center">
                <HoverBorderGradient 
                    className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-10 py-5 hover:cursor-pointer"
                    as="button"
                    onClick = {() => {navigate('/login')}}>
                        <span>Get Started</span>
                </HoverBorderGradient>
            </div>
        </div>
    );
}
