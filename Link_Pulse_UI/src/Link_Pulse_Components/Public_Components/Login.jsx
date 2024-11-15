import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';
import { APPS } from '../../../Utils/constants';
import { Toaster, toast } from 'react-hot-toast';

const Login = () => {

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        userEmail: '',
        userPassword: '',
        subDomain: ''
    });

    const updateForm = (e) => {

        const value = e.target.value;

        setCredentials({...credentials, [e.target.name] : value});

    }

    const loginFormFunction = async (e) => {

        e.preventDefault();

        const subDomain = credentials.subDomain.toLowerCase();

        const app = APPS.find((app) => {

            return subDomain === app.subdomain
    
        })

        if ( app ) {

            if ( subDomain === 'accenture') {

                try {

                    const response = await axios.post('http://localhost:7777/api/v1/public/authenticate', credentials)

                    if ( response.status === 200 ) {

                        const accenture_access_token = response.data.access_token;

                        const role = response.data.userRole;

                        Cookies.remove('accenture_access_token');

                        // Store the token in a cookie
                        Cookies.set('accenture_access_token', accenture_access_token, {
                            path: '/',
                            domain: '.linkpulse.in', 
                            expires: 1,
                            secure: false, // Set to true if using HTTPS
                            sameSite: 'Lax' // Allows sharing across subdomains
                        });

                        toast.success("Login Successfull", {
                            duration: 2000
                        })

                        setCredentials({
                            userEmail: '',
                            userPassword: '',
                            subDomain: ''
                        });

                        if ( role === 'ADMIN' ){

                            const redirectUrl = `http://${subDomain}.linkpulse.in:7778/admin-dashboard`;

                            setTimeout(() => {
    
                                window.open(redirectUrl, "_self");
    
                            }, 2000);

                        }

                    }

                }catch(error) {

                    if ( error.response ) {

                        if ( error.response.status === 403 ) {

                            console.log(error);

                            toast.error("No User Found", {
                                duration: 2000
                            })

                        }

                    }

                }
                
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
                <title> Login | LinkPulse </title>
                <meta name="description" content="LinkPulse Website Login Page." />
                <meta name="keywords" content="LinkPulse, Register, Login, Terms, Conditions" />
            </Helmet>

        
            <div className="flex justify-end max-sm:justify-center absolute top-0 bottom-0 left-0 right-0">

                <div className="max-sm:hidden flex-1">

                    <img 
                        src='/Link_Pulse_Images/Login/Login_LinkPulse.webp'
                        alt='Link Pulse Login Image'
                        className='object-cover h-full w-full'
                    />

                </div>

                <div className="bg-white flex flex-col max-sm:min-w-[350px] max-w-[450px]">

                    <div className="mx-20 max-sm:mx-10 max-sm:mt-[30px] mt-[130px] text-xl font-semibold">

                        Login To LinkPulse

                    </div> 

                    <form
                        onSubmit={(e) => loginFormFunction(e)}
                    >

                        <div
                            className="w-full flex mt-5"
                        >

                            <input 
                                required
                                className='border-2 border-gray-300 ml-20 w-full leading-[30px] text-[14px] mt-1 focus:border-[#66B2FF] focus:outline-none focus:ring-0 transition-all px-3 max-sm:ml-10'
                                placeholder='Org Domain'
                                name='subDomain'
                                value={credentials.subDomain}
                                onChange={(e) => updateForm(e)}
                            />

                            <input
                                disabled
                                value={".linkpulse.in"}
                                className='border-2 border-gray-300 bg-gray-100 mr-20 w-full leading-[30px] text-[14px] mt-1 hover:border-[#66B2FF] focus:outline-none focus:ring-0 transition-all px-3 max-sm:mr-10 text-black'
                            />
                        
                        </div>

                        <div className="mt-5 mx-20 max-sm:mx-10 text-sm">

                            Email

                        </div>

                        <div className="w-full flex">

                            <input 
                                type='email'
                                placeholder='Email'
                                className='border-2 border-gray-300 w-full mx-20 max-sm:mx-10 leading-[40px] text-[15px] mt-1 focus:border-[#66B2FF] focus:outline-none focus:ring-0 transition-all px-3'
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
                                type='password'
                                placeholder='Password'
                                className='border-2 border-gray-300 w-full mx-20 max-sm:mx-10 leading-[40px] text-[15px] mt-1 focus:border-[#66B2FF] focus:outline-none focus:ring-0 transition-all px-3'
                                value={credentials.userPassword}
                                name='userPassword'
                                onChange={(e) => updateForm(e)}
                            />

                        </div>

                        <div className="flex">

                            <button
                                className='bg-[#66B2FF] text-white w-full py-3 mx-20 max-sm:mx-10 mt-5 active:opacity-60'
                                type='submit'
                            >

                                Continue

                            </button>

                        </div>

                    </form>

                    <div className="flex flex-col mt-5 justify-center text-center text-xs text-gray-400">

                        Not Registered Yet? <br />

                        <button
                            onClick={() => navigate('/register')}
                            className='cursor-pointer hover:opacity-80 active:opacity-40'
                        >
                            
                            Register

                        </button>

                    </div>

                    <div className="flex mt-auto mb-5 mx-20 text-[13px] text-gray-500 max-sm:text-[8px] justify-center">

                        By Continuing, you agree to our <span className='underline ml-1'> Terms and Policies </span>

                    </div>

                </div>

            </div>
        
        </>

    )

}

export default Login