
import React from 'react'
import { useState, useRef, } from 'react'
import { gsap } from "gsap";
import { useGSAP } from '@gsap/react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import LightPillar from '../components/ui/LightPillar';
import Signup from '../components/Signup'
import Signin from '../components/Signin'
import Logo from '../components/Logo';
import Logo_2 from '../components/Logo_2';


const UserSigninSignup = () => {

    const [toggle, setToggle] = useState(false)
    const [firstRender, setFirstRender] = useState(true)


    const togglePanelRef = useRef(null);
    const signinRef = useRef(null);
    const signupRef = useRef(null);
    const emptyRef = useRef(null);


    useGSAP(() => {

        if (firstRender) {
            setFirstRender(false) // skip the first render
            return;
        }

        const tl = gsap.timeline();
        if (toggle) {
            tl.to(togglePanelRef.current, {
                width: '80vw',
                left: '0%',
                borderTopRightRadius: "100px",
                borderBottomRightRadius: "100px",
                duration: 0.5,
                ease: 'power2.out',
            }).to(togglePanelRef.current, {
                width: '40vw',
                left: '50%',
                borderTopRightRadius: "100px",
                borderBottomRightRadius: "100px",
                borderTopLeftRadius: "50%",
                borderBottomLeftRadius: "50%",
                duration: 0.5,
                ease: 'power2.out',
            });
        } else {
            tl.to(togglePanelRef.current, {
                width: '80vw',
                left: '0%',
                borderTopLeftRadius: "100px",
                borderBottomLeftRadius: "100px",
                duration: 0.5,
                ease: 'power2.out',
            }).to(togglePanelRef.current, {
                width: '40vw',
                left: '0%',
                borderTopRightRadius: "50%",
                borderBottomRightRadius: "50%",
                borderTopLeftRadius: "100px",
                borderBottomLeftRadius: "100px",
                duration: 0.5,
                ease: 'power2.out',
            });
        }
    }, [toggle]);

    useGSAP(() => {
        if (!signinRef.current || !signupRef.current || !emptyRef.current) return;

        const tl = gsap.timeline();

        if (toggle) {
            // -------- SIGNIN → SIGNUP --------

            tl.to(signinRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.35,
                ease: "power2.out",
                onComplete: () => {
                    gsap.set(signinRef.current, {
                        visibility: "hidden",
                        pointerEvents: "none"
                    });
                }
            });

            tl.set(emptyRef.current, { visibility: "visible" });

            tl.fromTo(emptyRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.2 }
            );

            tl.set(signupRef.current, {
                visibility: "visible",
                pointerEvents: "auto"
            });

            tl.fromTo(
                signupRef.current,
                { opacity: 0, y: 20, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
            );

        } else {
            // -------- SIGNUP → SIGNIN --------

            tl.to(signupRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.35,
                ease: "power2.out",
                onComplete: () => {
                    gsap.set(signupRef.current, {
                        visibility: "hidden",
                        pointerEvents: "none"
                    });
                }
            });

            tl.to(emptyRef.current, {
                opacity: 0,
                duration: 0.2
            });

            tl.set(signinRef.current, {
                visibility: "visible",
                pointerEvents: "auto"
            });

            tl.fromTo(
                signinRef.current,
                { opacity: 0, y: -20, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
            );
        }

    }, [toggle]);



    return (
        // bg-gradient-to-br from-[#000000] via-[#ad6c2a] to-[#000000]
        <div className='relative items-center h-screen '>

            <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 0 }}>
                <LightPillar
                    topColor="#FFE7B3"
                    bottomColor="#FF9900"
                    intensity={1}
                    rotationSpeed={0.3}
                    glowAmount={0.002}
                    pillarWidth={1}
                    pillarHeight={0.4}
                    noiseIntensity={0.5}
                    pillarRotation={45}
                    interactive={false}
                    mixBlendMode="screen"
                    quality="high"
                />

                {/* <img src={logo} alt="" className='fixed h-35 left-1.5 top-1.5 bg-amber-200 bg-clip-text text-transparent' /> */}
                <div className="fixed  -top-8 -left-8" >
                    <Logo
                        style={{ height: '60px' }}
                        height={'180'}
                        color_1={"#C2410C"}
                        color_2={"#F97316"}
                    />

                </div>
                <div className='flex justify-center items-center h-full'>


                    <div className='relative flex h-[80vh] w-[80vw] overflow-hidden rounded-[100px] p-[2px] border-[1px] border-white/10 bg-black/30 shadow-2xl'>
                        {/* <span className="relative inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[100px]  px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl "> */}

                        {/* bg-gradient-to-tr from-orange-600/40 via-transparent to-amber-400/30 */}
                        <div
                            ref={togglePanelRef}
                            className='  bg-[#261400]/90  shadow-lg h-[80vh] w-[40vw] rounded-l-[100px] rounded-r-[50%] absolute z-10 left-0 '>


                            <div className='flex flex-col items-center justify-center h-full'>
                                <div className="flex items-center justify-center h-[60%]">

                                    {toggle ? (
                                        <h1 className="text-5xl font-extrabold text-[#FEC28B] leading-snug max-w-md drop-shadow-[0_0_20px_rgba(255,140,0,0.25)]">
                                            Join now. Take control of your money.
                                        </h1>
                                    ) : (
                                        <h1 className="text-5xl font-extrabold text-[#FEC28B] leading-snug max-w-md drop-shadow-[0_0_20px_rgba(255,140,0,0.25)]">
                                            Welcome back. Stay on top of your money.
                                        </h1>
                                    )}

                                </div>

                                {/* ===== Bottom action zone ===== */}
                                <div className="flex flex-col items-center justify-end gap-4  mb-10">

                                    {/* guiding text near button */}
                                    <p className="text-[#9a9a9a] text-sm ">
                                        {toggle
                                            ? "Already have an account? Sign in to continue."
                                            : "New here? Create your account and start tracking smarter."
                                        }
                                    </p>
                                    <button
                                        onClick={() => setToggle(prev => !prev)}
                                        className="relative h-15 overflow-hidden rounded-full p-[1px] ">
                                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FD9330_0%,#FEDEB8_50%,#FD9330_100%)] py-10" />
                                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-10 py- text-sm font-medium text-white backdrop-blur-3xl">
                                            {toggle ? 'Sign In' : 'Create Account'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-between gap-36  w-full '

                        >
                            <div className='w-1/2'
                                ref={signupRef}>
                                <Signup />
                            </div>
                            <div ref={emptyRef} className="invisible opacity-0">
                                {/* empty placeholder */}
                            </div>

                            <div className='w-1/2'
                                ref={signinRef}>
                                <Signin />
                            </div>
                        </div>
                        {/* </span> */}


                    </div>
                </div>
            </div>
        </div >
    )
}

export default UserSigninSignup
