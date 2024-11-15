import React, { useEffect, useState } from 'react'
import { MdOutlineArrowDropUp } from 'react-icons/md'
import { Outlet, useNavigate } from 'react-router-dom';

const AdminManage = () => {

    // useNavigate Hook
    const navigate = useNavigate();

    // State to activate/deactive project manage page
    const [isProjectManagePage, setIsProjectManagePage] = useState(false);

    // State to activate/deactive department manage page
    const [isDepartmentManagePage, setIsDepartmentManagePage] = useState(false);

    // State to activate/deactive designation manage page
    const [isDesignationManagePage, setIsDesignationManagePage] = useState(false);

    // path name of the current url
    const pathName = window.location.pathname;

    useEffect(() => {

        if ( pathName ===  `/admin-manage-projects` ){

            setIsProjectManagePage(true);

        }else {

            setIsProjectManagePage(false);

        }

        if ( pathName ===  `/admin-manage-designations` ){

            setIsDesignationManagePage(true);

        }else {

            setIsDesignationManagePage(false);

        }

        if ( pathName ===  `/admin-manage-departments` ){

            setIsDepartmentManagePage(true);

        }else {

            setIsDepartmentManagePage(false);

        }

    }, [pathName]);

    return (

        <>

            <div className="flex space-x-5 bg-gray-200 border-[1px] border-gray-300 mr-10">

                <div 
                    className="relative py-3 hover:text-customBlueLeftNavBar transition-all cursor-pointer pl-10"
                    onClick={() => navigate(`/admin-manage-projects`)}
                >

                    MANAGE PROJECTS

                    {isProjectManagePage && (

                        <MdOutlineArrowDropUp 
                            className='absolute left-24 bottom-[-10px] text-customBlueLeftNavBar text-2xl'
                        />

                    )}

                </div>

                <div 
                    className="relative py-3 hover:text-customBlueLeftNavBar transition-all cursor-pointer pl-10"
                    onClick={() => navigate(`/admin-manage-departments`)}
                >

                    MANAGE DEPARTMENTS

                    {isDepartmentManagePage && (

                        <MdOutlineArrowDropUp 
                            className='absolute left-[120px] bottom-[-10px] text-customBlueLeftNavBar text-2xl'
                        />

                    )}

                </div>

                <div 
                    className="relative py-3 hover:text-customBlueLeftNavBar transition-all cursor-pointer pl-10"
                    onClick={() => navigate(`/admin-manage-designations`)}
                >

                    MANAGE DESIGNATIONS

                    {isDesignationManagePage && (

                        <MdOutlineArrowDropUp 
                            className='absolute left-[120px] bottom-[-10px] text-customBlueLeftNavBar text-2xl'
                        />

                    )}

                </div>

            </div>

            <Outlet />

        </>

    )

}

export default AdminManage