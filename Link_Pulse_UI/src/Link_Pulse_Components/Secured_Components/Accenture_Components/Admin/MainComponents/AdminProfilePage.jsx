import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import { MdMailOutline, MdOutlineArrowDropDown, MdOutlineArrowDropUp, MdOutlineLocalPhone, MdOutlineLocationOn } from 'react-icons/md';
import { Outlet, useNavigate } from 'react-router-dom';

const AdminProfilePage = () => {

    // JWT_TOKEN 
    const access_token = Cookies.get('accenture_access_token');

    // useNavigate Hook
    const navigate = useNavigate();

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

    const [isAboutProfilePage, setIsAboutProfilePage] = useState(false);

    const [isJobProfilePage, setIsJobProfilePage] = useState(false);

    const [showActions, setShowActions] = useState(false);

    const pathName = window.location.pathname;

    useEffect(() => {

        fetchImage();

    }, []);

    useEffect(() => {

        if ( pathName === `/admin-profile-page` ){

            setIsAboutProfilePage(true);

        }else{

            setIsAboutProfilePage(false);

        }

        if ( pathName === `/admin-job-page`){

            setIsJobProfilePage(true);

        }else {

            setIsJobProfilePage(false);

        }

    }, [pathName]);

    return (

        <>
        
            <div className="">

                <div className="flex border-[1px] border-gray-300 mr-10 bg-white">

                    <div className="">

                        {imageSrc && imageSrc.length > 0 ? (
                            <img 
                            src={imageSrc}
                            className='w-[300px] h-auto object-cover'
                            />
                        ) : (
                            <img 
                            src='/Secured_Images/Accenture_Images/emptyuser.jpeg'
                            className='w-[300px] h-auto object-cover '
                        />
                        )}      

                    </div>    

                    <div className="w-full">

                        <div className="text-2xl mt-5 ml-5">

                            Surya Vamsi

                        </div>

                        <div className="flex items-center space-x-10 mt-5
                        pb-5 border-b-[1px] border-gray-300 ml-5">

                            <div className="flex items-center">

                                <MdOutlineLocationOn 
                                    className='mr-1 text-gray-600'
                                /> 
                                Accenture | Hyderabad, India

                            </div>

                            <div className="flex items-center">

                                <MdMailOutline 
                                    className='mr-1 text-gray-600'
                                />
                                iamsuryavamsi@gmail.com

                            </div>

                            <div className="flex items-center">

                                <MdOutlineLocalPhone 
                                    className='mr-1 text-gray-600'
                                />
                                +91 9701384817

                            </div>

                        </div>

                        <div className="flex my-5 ml-5">

                            <div className="grid grid-cols-4 w-[80%]">

                                <div className="">

                                    <span className='text-gray-600 text-sm'>DESIGNATION</span> <br />
                                    <span>Lead Engineer</span>

                                </div>

                                <div className="">

                                    <span className='text-gray-600 text-sm'>DEPARTMENT</span><br />
                                    Engineering

                                </div>

                                <div className="">

                                    <span className='text-gray-600 text-sm'>REPORTING TO</span><br />
                                    Vijay Prakash Yalamarchili

                                </div>

                                <div className="">

                                    <span className='text-gray-600 text-sm'>EMPLOYEE NO</span> <br />
                                    E4569

                                </div>

                            </div>

                            <div className="relative">

                                <div 
                                    className="flex items-center justify-center bg-customBlueLinkPulseBase hover:opacity-80 active:opacity-60 transition-all focus:outline-none text-white rounded-lg px-3 py-3 cursor-pointer"
                                    onClick={() => {

                                        if ( !showActions ){

                                            setShowActions(true);

                                        } else {

                                            setShowActions(false);

                                        }

                                    }}    
                                >

                                    <button
                                        className='focus:outline-none'
                                    >

                                        Actions

                                    </button>


                                    <MdOutlineArrowDropDown 
                                            className='ml-1 text-2xl'
                                        />

                                </div>

                                {showActions && (

                                    <div className="absolute top-[105%] left-0 w-full bg-customBlueLinkPulseBase text-white">

                                        <ul>

                                            <li
                                                className='px-3 py-2 hover:opacity-80 active:opacity-60 focus:outline-none border-b-[1px] border-gray-200 cursor-pointer'
                                            >Edit Profile</li>

                                            <li
                                                className='px-3 py-2 hover:opacity-80 active:opacity-60 focus:outline-none border-b-[1px] border-gray-200 cursor-pointer'
                                            >Action 02</li>

                                        </ul>

                                    </div>

                                )}

                            </div>

                        </div>

                        <div className="flex border-t-[1px] border-gray-300 bg-gray-200">

                            <div 
                                className="mx-5 text-lg hover:text-customBlueLeftNavBar transition-all py-3 cursor-pointer relative"
                                onClick={() => navigate(`/admin-profile-page`)}  
                            >

                                About

                                {isAboutProfilePage && (

                                    <MdOutlineArrowDropUp 
                                        className='absolute left-4 bottom-[-10px] text-customBlueLeftNavBar text-2xl'
                                    />

                                )}

                            </div>  

                            <div 
                                className="mx-5 text-lg hover:text-customBlueLeftNavBar transition-all py-3 cursor-pointer relative"
                                onClick={() => navigate(`/admin-job-page`)}    
                            >

                                Job

                                {isJobProfilePage && (

                                    <MdOutlineArrowDropUp 
                                        className='absolute left-1 bottom-[-10px] text-customBlueLeftNavBar text-2xl'
                                    />

                                )}

                            </div>

                        </div>

                    </div> 

                </div> 

                <Outlet />

            </div>
        
        </>

    )

}

export default AdminProfilePage