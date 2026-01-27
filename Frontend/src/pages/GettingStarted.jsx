"use client";
import React from "react";
import HoverBorderGradient from "../components/ui/hover-border-gradient";
import { useNavigate } from "react-router-dom";
import SplitText from "../components/ui/SplitText";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Navbar from "./Navbar";
import { User, Headset, Question } from "@phosphor-icons/react"
import LightRays from '../components/ui/LightRays';

export default function SparklesPreview() {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden text-white px-10">

            <div style={{ width: '100%', height: '600px', position: 'fixed' }}>
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#FF9A2E"
                    raysSpeed={1}
                    lightSpread={0.5}
                    rayLength={3}
                    followMouse={true}
                    mouseInfluence={0.1}
                    noiseAmount={0}
                    distortion={0}
                    className="custom-rays"
                    pulsating={false}
                    fadeDistance={1}
                    saturation={1}
                />
            </div>
{/* rgba(219,137,4,0.55) */}
            {/* LEFT glow */}
            <div
                className="pointer-events-none absolute top-1/4 -left-56 -translate-y-1/2 h-[900px] w-[1000px] bg-[radial-gradient(circle_at_left,rgba(230,121,2,0.55),transparent_60%)] blur-2xl"
            />
            <div
                className="pointer-events-none absolute top-30 -left-40 -translate-y-1/2 h-[400px] w-[900px] bg-[radial-gradient(circle_at_left,rgba(255,132,0,0.15),transparent_80%)] blur-xl"
            />
{/* rgba(247,154,2,0.15) */}
            {/* RIGHT glow */}
            <div
                className="pointer-events-none absolute -top-32 -right-32 h-[600px] w-[600px] bg-[radial-gradient(circle_at_top_right,rgba(255,132,0,0.65),transparent_55%)] blur-xl"
            />

            {/* Logo */}
            <div className="flex items-center  h-20 ">

                <h1 className="relative z-10 mt-10 ml-14 text-center font-bold text-4xl md:text-7xl lg:text-4xl text-white">
                    TrackNest

                </h1>
            </div>

            {/* <Navbar /> */}

            {/* Main content */}
            <div className="relative z-10 mt-16 flex w-full h-[65vh] items-center justify-between">

                {/* LEFT content */}
                <div className="w-[40%] ml-50">

                    <h2 className="text-6xl font-semibold max-w-[14ch] leading-tight tracking-tight bg-gradient-to-br from-white to-orange-300 bg-clip-text text-transparent ">
                        Turn transactions into clear insights!
                    </h2>

                    <p className="mt-6 text-zinc-400 leading-relaxed">
                        Track every income and expense in one place, and turn your
                        transactions into meaningful insights. Understand spending
                        patterns, monitor cash flow, and make smarter financial decisions
                        with clean analytics.
                    </p>

                    <div className="mt-10">
                        <HoverBorderGradient
                            as="button"
                            onClick={() => navigate("/login")}
                            className="px-10 py-5 text-white hover:cursor-pointer"
                        >
                            Get Started
                        </HoverBorderGradient>
                    </div>
                </div>


                {/* RIGHT animation */}
                <div className="h-[65vh] max-w-[600px] absolute -right-16 -top-12">

                    <DotLottieReact
                        src="https://lottie.host/12d2df10-ca5a-4bde-a0f8-2f20fbd638bb/V2cQwdmlua.lottie"
                        loop
                        autoplay
                    />
                </div>


            </div>

            <div className="flex gap-10 items-center">
                <button
                    className="relative px-20 py-10 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-orange-500/15 via-orange-400/0 to-transparent backdrop-blur-2xl border border-orange-400/30 shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-all duration-300 hover:from-orange-500/20 hover:via-orange-400/5 hover:border-orange-400/30 hover:shadow-[0_0_35px_rgba(255,140,0,0.5)] active:scale-95 flex items-center justify-center gap-2"
                >
                    <User size={25} weight="fill" />
                    About Us
                </button>
                <button
                    className="relative px-20 py-10 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-orange-500/15 via-orange-400/0 to-transparent backdrop-blur-2xl border border-orange-400/30 shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-all duration-300 hover:from-orange-500/20 hover:via-orange-400/5 hover:border-orange-400/30 hover:shadow-[0_0_35px_rgba(255,140,0,0.5)] active:scale-95 flex items-center justify-center gap-2"
                >
                    <Headset size={25} weight="fill" />
                    Contact Us
                </button>
                <button
                    className="relative px-20 py-10 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-orange-500/15 via-orange-400/0 to-transparent backdrop-blur-2xl border border-orange-400/30 shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-all duration-300 hover:from-orange-500/20 hover:via-orange-400/5 hover:border-orange-400/30 hover:shadow-[0_0_35px_rgba(255,140,0,0.5)] active:scale-95 flex items-center justify-center gap-2"
                >
                    <Question size={25} weight="fill" />
                    Need Help
                </button>

            </div>


        </div>
    );
}
