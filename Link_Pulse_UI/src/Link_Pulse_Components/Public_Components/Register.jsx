import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { APPS } from '../../../Utils/constants'
import { toast, Toaster } from 'react-hot-toast'

const Register = () => {

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        firstName: '',
        lastName: '',
        userEmail: '',
        userPassword: '',
        conformUserPassword: '',
        subDomain: ''
    });

    const updateForm = (e) => {

        const value = e.target.value;

        setCredentials({...credentials, [e.target.name] : value});

    }

    const registerFormFunction = async (e) => {

        e.preventDefault();

        const subDomain = credentials.subDomain.toLowerCase();

        const app = APPS.find((app) => {

            return subDomain === app.subdomain
    
        })

        if ( app ) {

            if ( credentials.userPassword === credentials.conformUserPassword ){

                if ( subDomain === 'accenture') {

                    try {

                        const response = await axios.post('http://localhost:7777/api/v1/public/register', credentials);

                        if ( response.status === 200 ) {

                            toast.success("Registration Successful", {
                                duration: 2000
                            })            

                            setCredentials({
                                firstName: '',
                                lastName: '',
                                userEmail: '',
                                userPassword: '',
                                conformUserPassword: '',
                                subDomain: ''
                            });

                            setTimeout(() => {

                                navigate('/')

                            }, 2000);

                        } 

                    } catch (error) {

                        console.log(error);

                        if ( error.response ) {

                            if ( error.response.status === 403 ) {

                                toast.error("User Not Registered", {
                                    duration: 2000
                                })

                            }

                        }

                    }

                }

                // if ( subDomain === 'wipro') {

                //     try {

                //         const response = await axios.post('http://localhost:7776/api/v1/public/register', credentials);

                //         if ( response.status === 200 ) {

                //             toast.success("Registration Successful", {
                //                 duration: 1000
                //             })
                
                //             navigate('/')

                //             setCredentials({
                //                 firstName: '',
                //                 lastName: '',
                //                 userEmail: '',
                //                 userPassword: '',
                //                 conformUserPassword: '',
                //                 subDomain: ''
                //             });

                //         } 

                //     } catch (error) {

                //         console.log(error);

                //         if ( error.response ) {

                //             if ( error.response.status === 403 ) {

                //                 toast.error("User Not Registered", {
                //                     duration: 2000
                //                 })                

                //             }

                //         }

                //     }

                // }

            } else {

                toast.error("Passwords Not Matched", {
                    duration: 2000
                })

            }

        } else {

            toast.error("No Company Found", {
                duration: 2000
            })

        }

    }

    return (

        <>

            <Toaster />

            <Helmet>
                <title> Register | LinkPulse </title>
                <meta name="description" content="LinkPulse Website Register Page." />
                <meta name="keywords" content="LinkPulse, Register, Login, Terms, Conditions" />
            </Helmet>

        
            <div className="flex justify-end max-sm:justify-center absolute top-0 bottom-0 left-0 right-0">

                <div className="max-sm:hidden flex-1">

                    <img 
                        src='/Link_Pulse_Images/Register/Register_LinkPulse.webp'
                        alt='Link Pulse Register Image'
                        className='object-cover h-full w-full'
                    />

                </div>

                <div className="bg-white flex flex-col max-w-[450px]">

                    <div className="mx-20 max-sm:mx-10 max-sm:mt-[30px] mt-[130px] text-xl font-semibold">

                        Register To LinkPulse

                    </div> 

                    <form
                        onSubmit={(e) => registerFormFunction(e)}
                    >

                        <div
                            className="w-full flex mt-5"
                        >

                            <input 
                                required
                                className='border-2 border-gray-300 ml-20 w-full leading-[30px] text-[14px] mt-1 hover:border-[#66B2FF] focus:outline-none focus:ring-0 transition-all px-3 max-sm:ml-10'
                                placeholder='Org Domain'
                                name = 'subDomain'
                                value={credentials.subDomain}
                                onChange={(e) => updateForm(e)}
                            />

                            <input
                                disabled
                                value={".linkpulse.in"}
                                className='border-2 border-gray-300 bg-gray-100 mr-20 w-full leading-[30px] text-[14px] mt-1 hover:border-[#66B2FF] focus:outline-none focus:ring-0 transition-all px-3 max-sm:mr-10'
                            />
                        
                        </div>

                        <div className="mt-5 mx-20 max-sm:mx-10 text-sm">

                            First Name

                        </div>

                        <div className="w-full flex">

                            <input 
                                required
                                type='text'
                                value={credentials.firstName}
                                name='firstName'
                                onChange={(e) => updateForm(e)}
                                placeholder='First Name'
                                className='border-2 border-gray-300 w-full mx-20 max-sm:mx-10 leading-[40px] text-[14px] mt-1 hover:border-[#66B2FF] focus:outline-none focus:ring-0 transition-all px-3'
                            />

                        </div>

                        <div className="mt-5 mx-20 max-sm:mx-10 text-sm">

                            Last Name

                        </div>

                        <div className="w-full flex">

                            <input 
                                required
                                type='text'
                                placeholder='Last name'
                                className='border-2 border-gray-300 w-full mx-20 max-sm:mx-10 leading-[40px] text-[15px] mt-1 hover:border-[#66B2FF] focus:outline-none focus:ring-0 transition-all px-3'
                                value={credentials.lastName}
                                name='lastName'
                                onChange={(e) => updateForm(e)}
                            />

                        </div>

                        <div className="mt-5 mx-20 max-sm:mx-10 text-sm">

                            Email

                        </div>

                        <div className="w-full flex">

                            <input 
                                required
                                type='email'
                                placeholder='Email'
                                className='border-2 border-gray-300 w-full mx-20 max-sm:mx-10 leading-[40px] text-[15px] mt-1 hover:border-[#66B2FF] focus:outline-none focus:ring-0 transition-all px-3'
                                value={credentials.userEmail}
                                name='userEmail'
                                onChange={(e) => updateForm(e)}
                            />

                        </div>

                        <div className="mt-5 mx-20 max-sm:mx-10 text-sm">

                            Password

                        </div>

                        <div className="w-full flex">

                            <input 
                                required
                                type='password'
                                placeholder='Password'
                                className='border-2 border-gray-300 w-full mx-20 max-sm:mx-10 leading-[40px] text-[15px] mt-1 hover:border-[#66B2FF] focus:outline-none focus:ring-0 transition-all px-3'
                                value={credentials.userPassword}
                                name='userPassword'
                                onChange={(e) => updateForm(e)}
                            />

                        </div>

                        <div className="mt-5 mx-20 max-sm:mx-10 text-sm">

                            Conform Password

                        </div>

                        <div className="w-fulEmaill flex">

                            <input 
                                required
                                type='password'
                                placeholder='Conform Password'
                                className='border-2 border-gray-300 w-full mx-20 max-sm:mx-10 leading-[40px] text-[15px] mt-1 mb-3 hover:border-[#66B2FF] focus:outline-none focus:ring-0 transition-all px-3'
                                value={credentials.conformUserPassword}
                                name='conformUserPassword'
                                onChange={(e) => updateForm(e)}
                            />

                        </div>

                        <div className="flex">

                            <button
                                className='bg-[#66B2FF] text-white w-full py-3 mx-20 max-sm:mx-10 active:opacity-60'
                                type='submit'
                            >

                                Continue

                            </button>

                        </div>

                    </form>

                    <div className="flex flex-col mt-5 justify-center text-center text-xs text-gray-400">

                        Already Registered ? <br />

                        <button
                            onClick={() => navigate('/login')}
                            className='cursor-pointer hover:opacity-80 active:opacity-40'
                        >
                            
                            Login

                        </button>

                    </div>

                    <div className="flex mt-auto mb-5 mx-20 text-[13px] text-gray-500 max-sm:text-[8px] justify-center max-sm:pb-10">

                        By Continuing, you agree to our <span className='underline ml-1'> Terms and Policies </span>

                    </div>

                </div>

            </div>

        </>
        
    )

}

export default Register