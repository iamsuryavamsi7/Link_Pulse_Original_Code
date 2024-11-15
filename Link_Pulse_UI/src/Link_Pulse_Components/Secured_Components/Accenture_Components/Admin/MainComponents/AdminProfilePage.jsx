import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import { MdMailOutline, MdOutlineArrowDropDown, MdOutlineArrowDropUp, MdOutlineLocalPhone, MdOutlineLocationOn } from 'react-icons/md';
import { Outlet, useNavigate } from 'react-router-dom';
import { CgCloseO } from 'react-icons/cg';
import { Toaster, toast } from 'react-hot-toast';

const AdminProfilePage = () => {

    // JWT_TOKEN 
    const access_token = Cookies.get('accenture_access_token');

    // Role to check
    const [role, setRole] = useState(null);

    // Admin value to check
    const admin = 'ADMIN';

    // useNavigate Hook
    const navigate = useNavigate();

    // useRef for upload image in edit mode
    const fileInputRef = useRef(null);

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

                const responseData = response.data;

                const imageBlob = URL.createObjectURL(responseData);

                setImageSrc(imageBlob);

                console.log(imageBlob);

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

    // State to store the style of about profile page
    const [isAboutProfilePage, setIsAboutProfilePage] = useState(false);

    // State to store the style of job profile page
    const [isJobProfilePage, setIsJobProfilePage] = useState(false);

    // State to show actions
    const [showActions, setShowActions] = useState(false);

    // State to activate and deactivate the edit mode
    const [editModeActivated, setEditModeActivated] = useState(false);

    // Edit mode profile pic source
    const [editModeImageSrc, setEditModeImageSrc] = useState(null);

    // Image src for edit mode form
    const [editModeImageFormSrc, setEditModeImageFormSrc] = useState(null);

    const [updateProfileData, setUpdateProfileData] = useState({
        firstName: '',
        lastName: '',
        about: '',
        whatILoveAboutMyJob: ''
    });
    
    const handleUpdateImageInputFunction = (e) => {

        const file = e.target.files[0];

        if ( file ){

            setEditModeImageSrc(URL.createObjectURL(file));

            setEditModeImageFormSrc(file);

        }

    }

    // Function for update profile
    const editProfileFormFunction = async (e) => {

        e.preventDefault();

        const formData = new FormData();

        if ( editModeImageSrc ) {

            formData.append('updateImageSrc', editModeImageFormSrc);

        }

        formData.append('firstName', updateProfileData.firstName);
        formData.append('lastName', updateProfileData.lastName);
        formData.append('about', updateProfileData.about);
        formData.append('whatILoveAboutMyJob', updateProfileData.whatILoveAboutMyJob);

        try{

            const response = await axios.post(`http://localhost:7777/api/v1/accenture-admin/updateProfileData`, formData, {
                headers: {
                    Authorization: `Bearer ${access_token}`
            }});

            if ( response.status === 200 ){

                const responseData = response.data;

                console.log(responseData);

            }

        }catch(error){

            handleFetchError(error);

        }

    }

    // Function to fetch userObject for role
    const setRoleFunction = async () => {

        try{

            const response = await axios.get('http://localhost:7777/api/v1/accenture-admin/fetchUserObject', {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const userData = response.data;

                setRole(userData.role);

            }

        }catch(error){

            handleFetchError(error);

        }

    }

    useEffect(() => {

        fetchImage();

        setRoleFunction();

    }, []);

    const pathName = window.location.pathname;

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
        
            {role === admin && (

                <>

                    <Toaster />
                
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

                                            <div className="absolute top-[105%] left-0 flex w-[120px] border-[1px] border-gray-300 bg-white text-customBlueLinkPulseBase font-semibold">

                                                <ul
                                                    className='w-full'
                                                >

                                                    <li
                                                        className='px-3 py-2 hover:opacity-80 active:opacity-60 focus:outline-none border-b-[1px] border-gray-200 cursor-pointer'
                                                        onClick={() => {

                                                            setEditModeActivated(true); 

                                                            setShowActions(false);

                                                        }}
                                                    >Edit Profile</li>

                                                    <li
                                                        className='px-3 py-2 hover:opacity-80 active:opacity-60 focus:outline-none border-b-[1px] border-gray-200 cursor-pointer'
                                                    >Action 02</li>
                                                    
                                                    <li
                                                        className='px-3 py-2 hover:opacity-80 active:opacity-60 focus:outline-none border-b-[1px] border-gray-200 cursor-pointer'
                                                    >Action 03</li>

                                                </ul>

                                            </div>

                                        )}

                                    </div>

                                </div>

                                <div className="flex border-t-[1px] border-gray-200 bg-gray-200">

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

                    {editModeActivated && (

                        <div className="absolute top-0 right-0 left-0 bottom-0 flex justify-center items-center">

                            <form   
                                className="relative bg-white border-[1px] border-gray-200 p-7 rounded-md w-[400px]"
                                onSubmit={editProfileFormFunction}    
                            > 

                                <CgCloseO 
                                    className='absolute top-3 right-3 text-xl cursor-pointer'
                                    onClick={() => {

                                        setEditModeActivated(false);

                                        setEditModeImageSrc(null);

                                    }}
                                />

                                <p
                                    className='text-xl'
                                >Update Profile</p>

                                <div className="my-5 space-y-5">

                                    <div className="">

                                        {editModeImageSrc && editModeImageSrc.length > 0 ? (
                                            <img 
                                            src={editModeImageSrc}
                                            className='w-[150px] h-auto object-cover'
                                            />
                                        ) : (
                                            <img 
                                            src='/Secured_Images/Accenture_Images/emptyuser.jpeg'
                                            className='w-[150px] h-auto object-cover '
                                        />
                                        )} 

                                    </div>

                                    <div className="">

                                        <input 
                                            className='hidden'
                                            type='file'
                                            ref={fileInputRef}
                                            onChange={handleUpdateImageInputFunction}
                                        />

                                        <div
                                            className='inline-block cursor-pointer bg-gray-200 text-gray-600 py-2 px-2 rounded-sm text-sm hover:opacity-80 active:opacity-60'
                                            onClick={() => {

                                                fileInputRef.current.click();

                                            }}
                                        >

                                            Change Photo

                                        </div>

                                    </div>

                                    <div className="flex flex-col">

                                        <label className='text-xs text-gray-600 mb-1'>First Name</label>
                                        <input 
                                            type='text'
                                            className='focus:border-customBlueLinkPulseBase focus:outline-none border-2 px-1 rounded-md leading-8 text-sm'
                                            name='firstName'
                                            value={updateProfileData.firstName}
                                            onChange={(e) => {

                                                const value = e.target.value;

                                                setUpdateProfileData(
                                                    {...updateProfileData, [e.target.name] : value}
                                                )

                                            }}
                                        />

                                    </div>

                                    <div className="flex flex-col">

                                        <label className='text-xs text-gray-600 mb-1'>Last Name</label>
                                        <input 
                                            type='text'
                                            className='focus:border-customBlueLinkPulseBase focus:outline-none border-2 px-1 rounded-md leading-8 text-sm'
                                            name='lastName'
                                            value={updateProfileData.lastName}
                                            onChange={(e) => {

                                                const value = e.target.value;

                                                setUpdateProfileData(
                                                    {...updateProfileData, [e.target.name] : value}
                                                )

                                            }}
                                        />

                                    </div>

                                    <div className="flex flex-col">

                                        <label className='text-xs text-gray-600 mb-1'>About</label>
                                        <textarea 
                                            type='text'
                                            className='focus:border-customBlueLinkPulseBase focus:outline-none border-2 px-1 rounded-md leading-8 text-sm min-h-[50px] max-h-[150px]'
                                            name='about'
                                            value={updateProfileData.about}
                                            onChange={(e) => {

                                                const value = e.target.value;

                                                setUpdateProfileData(
                                                    {...updateProfileData, [e.target.name] : value}
                                                )

                                            }}
                                        />

                                    </div>

                                    <div className="flex flex-col">

                                        <label className='text-xs text-gray-600 mb-1'>What i love about my job</label>
                                        <textarea 
                                            type='text'
                                            className='focus:border-customBlueLinkPulseBase focus:outline-none border-2 px-1 rounded-md leading-8 text-sm min-h-[50px] max-h-[150px]'
                                            name='whatILoveAboutMyJob'
                                            value={updateProfileData.whatILoveAboutMyJob}
                                            onChange={(e) => {

                                                const value = e.target.value;

                                                setUpdateProfileData(
                                                    {...updateProfileData, [e.target.name] : value}
                                                )

                                            }}
                                        />

                                    </div>

                                </div>

                                <button
                                    type='submit'
                                    className='text-sm text-gray-600 border-gray-200 border-2 px-2 py-1 rounded-lg hover:opacity-80 active:opacity-60 focus:outline-none'
                                >

                                    Save

                                </button>

                            </form>

                        </div>
                        
                    )}
                
                </>

            )}

        </>

    )

}

export default AdminProfilePage