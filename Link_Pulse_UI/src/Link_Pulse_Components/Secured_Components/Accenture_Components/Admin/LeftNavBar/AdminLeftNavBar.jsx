import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import { TbLayoutDashboardFilled, TbReportSearch } from 'react-icons/tb';
import { MdCoPresent, MdNoteAlt, MdThumbsUpDown } from 'react-icons/md';
import { BsFillFileBarGraphFill } from 'react-icons/bs';
import { FaTeamspeak, FaUmbrellaBeach } from 'react-icons/fa6';
import { IoSettings } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

const AdminLeftNavBar = () => {

    // JWT_TOKEN
    const access_token = Cookies.get('accenture_access_token');

    // Role to store the data
    const [role, setRole] = useState();

    // Admin role value
    const admin = 'ADMIN';

    // State for settingsDragDown Option
    const [settingsDragDown, setSettingsDragDown] = useState(false);

    // useNavigate Hook
    const navigate = useNavigate();

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

    // Function to fetch userObject
    const fetchUserObjectLeftNavBar = async () => {

        try{

            const response = await axios.get('http://localhost:7777/api/v1/accenture-admin/fetchUserObject', {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const responseData = response.data;

                setRole(responseData.role);

            }

        }catch(error){

            handleFetchError(error);

        }

    }

    useEffect(() => {

        if ( !access_token ){



        }else {

            fetchUserObjectLeftNavBar();

        }

    });

    return (

        <div className="bg-[#F0F2F5] top-[80px] left-0 bottom-0 fixed text-center z-50 border-r-[1px] border-gray-400 flex flex-col">

            <Toaster/>
            
            {role === admin && (

                    <>
                  
                        <div className={`hover:bg-gray-300 cursor-pointer h-[50px] flex justify-start items-center transition-all duration-300 px-5 space-x-3 active:opacity-[0.6] rounded-lg navBar1`}
                            onClick={() => navigate('/admin-dashboard')} 
                        >

                            <div className="">

                                <TbLayoutDashboardFilled 
                                    className={`h-[25px] w-auto transition-all duration-300 navBar2`}
                                />

                            </div>

                            <div className="">

                                Dashboard

                            </div>

                        </div>

                        <div className={`hover:bg-gray-300 cursor-pointer h-[50px] flex justify-start items-center transition-all duration-300 px-5 space-x-3 active:opacity-[0.6] rounded-lg navBar1`}
                            onClick={() => navigate('/time-sheets')}
                        >

                            <div className="">

                                <MdNoteAlt
                                    className={`h-[25px] w-auto transition-all duration-300 navBar2`}
                                />

                            </div>

                            <div className="">

                                Time Sheets

                            </div>

                        </div>

                        <div className={`hover:bg-gray-300 cursor-pointer h-[50px] flex justify-start items-center transition-all duration-300 px-5 space-x-3 active:opacity-[0.6] rounded-lg navBar1`}
                            onClick={() => navigate('/admin-employee-approvals')}
                        >

                            <div className="">

                                <MdThumbsUpDown
                                    className={`h-[25px] w-auto transition-all duration-300 navBar2`}
                                />

                            </div>

                            <div className="">

                                Employee Approval

                            </div>

                        </div>

                        <div className={`hover:bg-gray-300 cursor-pointer h-[50px] flex justify-start items-center transition-all duration-300 px-5 space-x-3 active:opacity-[0.6] rounded-lg navBar1`}
                            onClick={() => navigate('/insights')}
                        >

                            <div className="">

                                <BsFillFileBarGraphFill
                                    className={`h-[25px] w-auto transition-all duration-300 navBar2`}
                                />

                            </div>

                            <div className="">

                                Insights

                            </div>

                        </div>

                        <div className={`hover:bg-gray-300 cursor-pointer h-[50px] flex justify-start items-center transition-all duration-300 px-5 space-x-3 active:opacity-[0.6] rounded-lg navBar1`}
                            onClick={() => navigate('/attendence-management')}
                        >

                            <div className="">

                                <MdCoPresent
                                    className={`h-[25px] w-auto transition-all duration-300 navBar2`}
                                />

                            </div>

                            <div className="">

                                Attendence Management

                            </div>

                        </div>

                        <div className={`hover:bg-gray-300 cursor-pointer h-[50px] flex justify-start items-center transition-all duration-300 px-5 space-x-3 active:opacity-[0.6] rounded-lg navBar1`}
                            onClick={() => navigate('/leave-request')}
                        >

                            <div className="">

                                <FaUmbrellaBeach
                                    className={`h-[25px] w-auto transition-all duration-300 navBar2`}
                                />

                            </div>

                            <div className="">

                                Leave Request

                            </div>

                        </div>

                        <div className={`hover:bg-gray-300 cursor-pointer h-[50px] flex justify-start items-center transition-all duration-300 px-5 space-x-3 active:opacity-[0.6] rounded-lg navBar1`}
                            onClick={() => navigate('/reports')}
                        >

                            <div className="">

                                <TbReportSearch
                                    className={`h-[25px] w-auto transition-all duration-300 navBar2`}
                                />

                            </div>

                            <div className="">

                                Reports

                            </div>

                        </div>

                        <div className={`hover:bg-gray-300 cursor-pointer h-[50px] flex justify-start items-center transition-all duration-300 px-5 space-x-3 active:opacity-[0.6] rounded-lg navBar1`}
                            onClick={() => navigate('/teams')}
                        >

                            <div className="">

                                <FaTeamspeak
                                    className={`h-[25px] w-auto transition-all duration-300 navBar2`}
                                />

                            </div>

                            <div className="">

                                Teams

                            </div>

                        </div>
                        

                        <div className="relative mt-auto mb-5">

                            <div 
                                className={`hover:bg-gray-300 cursor-pointer h-[50px] flex justify-start items-center transition-all duration-300 px-5 space-x-3 active:opacity-[0.6] rounded-lg navBar1 bottom-4 w-full`}
                                onClick={() => {

                                    if ( settingsDragDown ){

                                        setSettingsDragDown(false);

                                    }else {

                                        setSettingsDragDown(true);

                                    }

                                }}
                            >
        
                                <div className="">
    
                                    <IoSettings
                                        className={`h-[25px] w-auto transition-all duration-300 navBar2`}
                                    />
    
                                </div>
    
                                <div className="">
    
                                    Settings
                                    
                                </div>
    
                            </div>

                            {settingsDragDown && (

                                <div className="absolute top-[-60px] left-3 cursor-pointer bg-gray-800 duration-300 text-white rounded-lg overflow-hidden settingsDropDown z-50"
                                onClick={() =>{

                                    navigate('/admin-manage-projects')

                                    setSettingsDragDown(false);

                                }}
                                >

                                    <ul
                                        className='px-5 py-3'
                                    >

                                        <li
                                            className=''
                                        > Manage Projects</li>

                                    </ul>

                                </div>

                            )}

                        </div>

                    </>  

                )}

        </div>

    )

}

export default AdminLeftNavBar