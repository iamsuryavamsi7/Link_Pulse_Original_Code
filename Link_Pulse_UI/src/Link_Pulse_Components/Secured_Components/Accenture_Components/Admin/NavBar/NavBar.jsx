import React, { useEffect, useState } from 'react'
import { AiFillNotification } from 'react-icons/ai'
import { FaArrowRightFromBracket, FaArrowRightToBracket } from 'react-icons/fa6'
import { IoIosSearch } from 'react-icons/io'
import Notifications from './Notifications/Notifications'
import Cookies from 'js-cookie'
import NavBarDropDown from './NavBarDropDown'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'

const NavBar = () => {

    // JWT_TOKEN
    const access_token = Cookies.get('accenture_access_token');

    const [userObject, setUserObject] = useState([]);

    const [notificationCount, setNotificationCount] = useState(7);

    const [conformCheckInActivated, setConformCheckInActivated] = useState(false);

    const [conformCheckOutActivated, setConformCheckOutActivated] = useState(false);

    const [notificationActive, setNotificationActive] = useState(false);

    const [profileViewTurnedOn, setProfileViewTurnedOn] = useState(false);

    // Profile pic source
    const [imageSrc, setImageSrc] = useState(null);

    const fetchImage = async () => {

        setImageSrc(null);

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/accenture-admin/downloadUserProfilePictureByName`, {
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                } 
            });

            if ( response.status === 200 ){

                const imageBlob = URL.createObjectURL(response.data);

                setImageSrc(imageBlob);

            }

        }catch(error){

            handleFetchError(error);

            setImageSrc(null);

        }

    }

    const FaArrowRightToBracketFunction = () => {

        if ( conformCheckInActivated ) {

            setConformCheckInActivated(false);

        }else {

            setConformCheckInActivated(true);

        }

    }

    const FaArrowRightFromBracketFunction = () => {

        if ( conformCheckOutActivated ) {

            setConformCheckOutActivated(false);

        }else {

            setConformCheckOutActivated(true);

        }

    }

    const AiFillNotificationFunction = () => {

        if ( notificationActive ) {

            setNotificationActive(false);

        }else {

            setNotificationActive(true);

        }

    }

    const profileFunction = () => {

        if ( profileViewTurnedOn ) {

            setProfileViewTurnedOn(false);

        }else {

            setProfileViewTurnedOn(true);

        }

    }

    // Common function to handle error
    const handleFetchError = (error) => {

        if ( error.response ) {

            if ( error.response.status === 403 ){

                console.log(error.response);

                toast.error('Something went wrong', {
                    duration: 2000
                });

            } else {

                console.log(error);

            }

        } else {

            console.error('Error fetching data', error);

        }

    }

    // Function to fech userObject
    const fetchUserObject = async () => {

        try{

            const response = await axios.get('http://localhost:7777/api/v1/accenture-admin/fetchUserObject', {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const userData = response.data;

                setUserObject(userData);

            }

        }catch(error){

            handleFetchError(error);

        }

    }


    // UseEffect Hook

    useEffect(() => {

        if ( !access_token ) {

            // window.open('http://localtest.me:7778/', "_self");

        } else {

            fetchUserObject();

            fetchImage();

            if ( notificationCount === 0 ) {

                setNotificationCount(null);

            }

            if ( notificationCount > 9 ) {

                setNotificationCount("9+");

            }

        }
        
    }, []);

    return (

        <div className="fixed z-50 left-0 right-0 top-0 h-[60px] bg-[#66B2FF] flex items-center justify-between">

            <Toaster />

            <div className="shrink-0 flex space-x-20">

                <img 
                    src='/Secured_Images/Accenture_Images/Accenture_Logo.webp'
                    className='h-[30px] w-auto mx-10'
                />

                <div className="shrink-0 relative">

                <input 
                    type='text'
                    className='focus:outline-none px-8 leading-8 rounded-lg'
                />

                <IoIosSearch 
                    className='absolute top-0 left-0 h-8 p-1 w-auto'
                />

            </div>

            </div>

            <div className="flex shrink-0 mx-10 space-x-8">

                <div className="relative">

                    <FaArrowRightToBracket 
                        className='h-[35px] w-[35px] bg-[#F0F2F5] px-2 py-1 rounded-[50%] hover:opacity-[0.8] active:opacity-[0.6] cursor-pointer duration-300 transition-all'
                        onClick={FaArrowRightToBracketFunction}
                    />

                    {conformCheckInActivated && (

                        <div className="absolute top-[49px] right-0 bg-white shadow-lg border-gray-200 border-[1px] rounded-b-lg w-28 text-center cursor-pointer text-base py-2 hover:opacity-90 active:opacity-40 transition-all tracking-wider">

                            Check In

                        </div>

                    )}
                    
                </div>

                <div className="relative">

                    <FaArrowRightFromBracket 
                        className='h-[35px] w-[35px] bg-[#F0F2F5] px-2 py-1 rounded-[50%] hover:opacity-[0.8] active:opacity-[0.6] cursor-pointer'
                        onClick={FaArrowRightFromBracketFunction}
                    />

                    {conformCheckOutActivated && (

                        <div className="absolute top-[49px] right-0 bg-white shadow-lg border-gray-200 border-[1px] rounded-b-lg w-28 text-center cursor-pointer text-base py-2 hover:opacity-90 active:opacity-40 transition-all tracking-wider">

                            Check Out

                        </div>

                    )}

                </div>

                <div className="relative">

                    <AiFillNotification 
                        className='h-[35px] w-[35px] bg-[#F0F2F5] px-2 py-1 rounded-[50%] hover:opacity-[0.8] active:opacity-[0.6] cursor-pointer'
                        onClick={AiFillNotificationFunction}
                    />

                    <div className="absolute top-[-7px] right-[-7px] rounded-[50%] text-[12px] font-semibold notificationClass bg-orange-500 px-[5px] text-white">


                        {notificationCount}

                        {notificationActive && (

                            <Notifications />

                        )}

                    </div>

                </div>

                <div className=""> 

                    {imageSrc && imageSrc.length > 0 ? (
                        <img 
                        src={imageSrc}
                        className='h-[38px] w-auto object-cover rounded-[50%] hover:opacity-[0.8] active:opacity-[0.6] cursor-pointer'
                        onClick={profileFunction}
                        />
                    ) : (
                        <img 
                        src='/Secured_Images/Accenture_Images/emptyuser.jpeg'
                        className='h-[38px] w-auto object-cover rounded-[50%] hover:opacity-[0.8] active:opacity-[0.6] cursor-pointer'
                        onClick={profileFunction}
                    />
                    )}

                    {profileViewTurnedOn && (

                        <NavBarDropDown 
                            userObject = {userObject}
                            imageSrc = {imageSrc}
                        />

                    )}

                </div>

            </div>

        </div>

    )

}

export default NavBar;