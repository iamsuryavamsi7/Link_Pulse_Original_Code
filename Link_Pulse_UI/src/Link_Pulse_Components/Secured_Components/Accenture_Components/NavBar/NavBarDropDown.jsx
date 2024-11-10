import React, { useState } from 'react'
import { AiFillNotification } from 'react-icons/ai'
import { IoIosSettings, IoMdHelpCircle } from 'react-icons/io'
import { IoLogOut } from 'react-icons/io5'
import { MdDarkMode } from 'react-icons/md'
import Cookies from 'js-cookie'
import axios from 'axios'
import {toast, Toaster} from 'react-hot-toast'

const NavBarDropDown = ({userObject}) => {

    // Profile pic source
    const [imageSrc, setImageSrc] = useState(null);

    // const fetchImage = async () => {

    //     setImageSrc(null);

    //     try{

    //         const response = await axios.get(`http://localhost:7777/api/v1/files/display/${userData.profilePathUrl}`, {
    //             responseType: 'blob',
    //             headers: {
    //                 'Authorization': `Bearer ${access_token}`
    //             } 
    //         });

    //         if ( response.status === 200 ){

    //             const imageBlob = URL.createObjectURL(response.data);

    //             setImageSrc(imageBlob);

    //         }

    //     }catch(error){

    //         handleFetchError(error);

    //         setImageSrc(null);

    //     }

    // }

    // Logout Function to make the user tokens expire
    const logoutFunction = async () => {

        try{

            const response = await axios.post('http://localhost:7777/api/v1/accenture/logout', {
                headers: {
                    'Authorization': `Bearer ${access_token}`   
                }
            });

            if ( response.status === 200 ) {

                Cookies.remove('access_token', { 
                    path: '/', 
                    domain: '.linkpulse.in' 
                });

                toast.success('Logout Successful', {
                    duration: 1000
                })

                setTimeout(() => {

                    window.open('http://linkpulse.in:7778', '_self')

                }, 2000);

            }

        }catch(error) {

            handleFetchError(error);

        }

    }

    return (

        <>

            <Toaster />
        
            <div className="absolute top-[60px] right-3 overflow-hidden h-auto transition-all duration-300 profileNavBarHide profileNavBar rounded-b-2xl bg-white">

                <ul
                    className='py-2 px-5 '                        
                >

                    <li
                        className='flex items-center space-x-2 w-full profileNavBar py-3 min-w-[300px] rounded-xl bg-gray-200 hover:bg-gray-300 active:opacity-[0.6] transition-all duration-300 cursor-pointer'
                    >

                        {imageSrc ? (
                            <img 
                            src={imageSrc}
                            className='h-[40px] w-auto object-cover rounded-[50%] ml-5'
                            />
                        ) : (
                            <img 
                            src='/Secured_Images/Accenture_Images/emptyuser.jpeg'
                            className='h-[40px] w-auto object-cover rounded-[50%] ml-5'
                        />
                        )}

                        <div className="block">

                            <p
                                className=''
                            > {userObject.userName} </p>

                            <p
                                className='text-[10px]'
                            > {userObject.designation ? (

                                <span>{userObject.designation}</span>

                            ): (

                                <span>No Data</span>

                            )} </p>

                        </div>

                    </li>

                    <li
                        className='mt-2 flex items-center space-x-2 w-full py-3 min-w-[300px] hover:bg-gray-200 transition-all duration-300 px-5 rounded-xl active:opacity-[0.6] cursor-pointer'
                    >  
                    
                        <div className="">

                            <AiFillNotification 
                                className='h-[30px] w-auto bg-gray-400 rounded-[50%] p-[5px]'
                            />

                        </div>

                        <div className="">

                            Notification
                            
                        </div>
                    
                    </li>

                    <li
                        className='flex items-center space-x-2 w-full py-3 min-w-[300px] hover:bg-gray-200 transition-all duration-300 px-5 rounded-xl active:opacity-[0.6] cursor-pointer'
                    > 

                        <div className="">

                            <IoIosSettings
                                className='h-[30px] w-auto bg-gray-400 rounded-[50%] p-[4px]'
                            />

                        </div>

                        <div className="">

                            Profile Settings

                        </div>

                    </li>

                    <li
                        className='flex items-center space-x-2 w-full py-3 min-w-[300px] hover:bg-gray-200 transition-all duration-300 px-5 rounded-xl active:opacity-[0.6] cursor-pointer'
                    >  
                    
                        <div className="">

                            <MdDarkMode 
                                className='h-[30px] w-auto bg-gray-400 rounded-[50%] p-[4px]'
                            />

                        </div>

                        <div className="">

                            Dark Mode
                            
                        </div>
                    
                    </li>

                    <li
                        className='flex items-center space-x-2 w-full py-3 min-w-[300px] hover:bg-gray-200 transition-all duration-300 px-5 rounded-xl active:opacity-[0.6] cursor-pointer'
                    >  
                    
                        <div className="">

                            <IoMdHelpCircle 
                                className='h-[30px] w-auto bg-gray-400 rounded-[50%] p-[4px]'
                            />

                        </div>

                        <div className="">

                            Help
                            
                        </div>
                    
                    </li>

                    <li
                        className='flex items-center space-x-2 w-full py-3 min-w-[300px] hover:bg-gray-200 transition-all duration-300 px-5 rounded-xl active:opacity-[0.6] cursor-pointer'
                        onClick={logoutFunction}
                    >

                        <div className="">

                            <IoLogOut 
                                className='h-[30px] w-auto bg-gray-400 rounded-[50%] p-[5px]'
                            />

                        </div>

                        <div className="">

                            Logout

                        </div>

                    </li>

                </ul>

            </div>

        </>

    )

}

export default NavBarDropDown