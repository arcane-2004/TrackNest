
import React from 'react'
import { useState, useRef } from 'react'
import { gsap } from "gsap";
import { useGSAP } from '@gsap/react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


import Signup from '../components/Signup'
import Signin from '../components/Signin'


const UserSigninSignup = () => {

    const [toggle, setToggle] = useState(false)
    const [firstRender, setFirstRender ] = useState(true)

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
        <div className='flex justify-center items-center h-screen bg-gradient-to-br from-[#000000] via-[#17aecc] to-[#000000] '>

            <div className='h-[80vh] w-[80vw] rounded-[100px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl'>
                <div
                    ref={togglePanelRef}
                    className='flex items-center justify-center bg-gradient-to-br from-[#00d9ff] to-[#000000]  shadow-lg h-[80vh] w-[40vw] rounded-l-[100px] rounded-r-[50%] absolute z-10'>

                    <button
                        onClick={() => setToggle(prev => !prev)}
                        className='bg-gray-400 px-8 py-4 rounded-4xl cursor-pointer'>
                        toggle

                    </button>
                </div>
                <div className='h-[80vh] w-[80vw] flex items-center'>
                    <Signup />
                    <Signin />
                </div>
            </div>


        </div>
    )
}

export default UserSigninSignup
