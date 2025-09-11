
import React from 'react'
import { useState, useRef } from 'react'
import { gsap } from "gsap";
import { useGSAP } from '@gsap/react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


import Signup from '../components/Signup'
import Signin from '../components/Signin'


const UserSigninSignup = () => {

    const [toggle, setToggle] = useState(false)
    const [firstRender, setFirstRender] = useState(true)


    const togglePanelRef = useRef(null);

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



    return (
        <div className='flex justify-center items-center h-screen bg-gradient-to-br from-[#000000] via-[#323e51] to-[#000000] '>

            <div className='relative flex h-[80vh] w-[80vw] overflow-hidden rounded-[100px] p-[2px] shadow-2xl  '>

                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#CBF7FF_0%,#0073FF_50%,#CBF7FF_100%)] p-[2px]" />
                <span className="relative inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[100px] bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl ">


                    <div
                        ref={togglePanelRef}
                        className='flex items-center justify-center bg-gradient-to-br from-[#788db0] to-[#010101]  shadow-lg h-[80vh] w-[40vw] rounded-l-[100px] rounded-r-[50%] absolute z-10 left-0'>


                        <button
                            onClick={() => setToggle(prev => !prev)}
                            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] ">
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#CBF7FF_0%,#0073FF_50%,#CBF7FF_100%)]" />
                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                                {toggle ? 'Sign In' : 'Create Account'}
                            </span>
                        </button>
                    </div>
                    <div className='flex items-center justify-between gap-36'>
                        <Signup />
                        <Signin />
                    </div>
                </span>


            </div>


        </div >
    )
}

export default UserSigninSignup
