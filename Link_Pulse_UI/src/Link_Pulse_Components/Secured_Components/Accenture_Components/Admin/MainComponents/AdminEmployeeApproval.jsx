import React, { useEffect, useId, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { SiTicktick } from 'react-icons/si';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { RiRefreshFill } from 'react-icons/ri';
import { Toaster, toast } from 'react-hot-toast';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { LuRefreshCw } from 'react-icons/lu';
import { BiRefresh } from 'react-icons/bi';

const AdminEmployeeApproval = () => {
    
    // Jwt Token
    const access_token = Cookies.get('accenture_access_token');

    // For Animations
    const [refreshAnimationState, setRefreshAnimationState] = useState(null);
    
    // State to store the role from fetched userObject
    const [role, setRole] = useState(null);

    // Constant value of admin
    const admin = 'ADMIN';

    // Setting user role with api call
    const setUserRoleFunction = async () => {
        
        try {
        
            const response = await axios.get(`http://localhost:7777/api/v1/accenture-admin/fetchUserObject`, {
        
                headers: { 'Authorization': `Bearer ${access_token}` }
        
            });
        
            if (response.status === 200) {
        
                const data = response.data;

                setRole(data.role);
        
            }
        
        } catch (error) {
        
            handleFetchError(error);
        
        }
    
    };

    // State to store the fetched locked users
    const [lockedUsers, setLockedUsers] = useState([]);

    // Fetch locked users
    const fetchLockedUsers = async () => {

        try {
        
            const response = await axios.get(`http://localhost:7777/api/v1/accenture-admin/fetch-locked-users/${page}/${pageSize}`, {
        
                headers: { 'Authorization': `Bearer ${access_token}` }
        
            });
        
            if (response.status === 200) {
        
                const users = response.data; 
        
                setLockedUsers(users);

            }
        
        } catch (error) {
        
            handleFetchError(error);

        }
    
    };

    // State to store the fetched Project Data
    const [projectData, setProjectData] = useState([]);

    // Function to fetch all projects
    const fetchAllProjects = async () => {

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/accenture-admin/fetch-all-projects`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const projectData = response.data;

                setProjectData(projectData);

            }

        }catch(error){

            handleFetchError(error);

        }

    }

    // default page number
    const [page, setPage] = useState(0); // Track the current page
    
    // Default no of items for page
    const pageSize = 10; 

    // State to store the boolean value of last page or not
    const [isLastPage, setIsLastPage] = useState(false);

    // Function for checking projects are available for next page
    const checkIfUserAreAvailable = async (pageNumber) => {

        const page = pageNumber;

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/accenture-admin/fetch-locked-users/${page}/${pageSize}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const responseData = response.data;

                if ( responseData.length > 0 ){

                    return true;

                }else {

                    return false;

                }

            }

        }catch(error){

            return false;

        }

    }

    // Function for next page
    const nextPage = async () => {

        if ( !isLastPage ){

            const pageNumber = page + 1;

            const response = await checkIfUserAreAvailable(pageNumber);

            if ( response ){

                setPage((prevPage) => prevPage + 1);

            } else {

                setIsLastPage(true);

                toast.error('Its the last page', {
                    duration: 2000
                })

            }

        } else {

            toast.error('Its the last page', {
                duration: 2000
            })

        }

    }

    // Function for previous page
    const prevPage = () => {

        if ( page > 0 ) {

            setPage((prevPage) => prevPage - 1);

            setIsLastPage(false);

        } else {

            toast.error('Its the first page', {
                duration: 2000
            })

        }

    }

    // refresh button function
    const refreshButtonFunction = () => {

        setRefreshAnimationState(`animate-spin`);

        fetchLockedUsers();

        setTimeout(() => {

            setRefreshAnimationState(null);
            
        }, 1000)

    }

    // State to check project manager is already available
    const [projectManagerAvailable, setProjectManagerAvailable] = useState(false);

    const [projectError, setProjectError] = useState(true);

    // Function for storing projectId value in state
    const projectIdOnChangeFunction = async (e) => {

        const projectId = e.target.value;

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/accenture-admin/checkIfProjectManagerIsAlreadyAssigned/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const responseData = response.data;

                setProjectError(false);

                setProjectManagerAvailable(responseData);

            }
            
        }catch(error){

            setProjectError(true);

            handleFetchError(error);

        }

        setEmployeeDetails(
            {...employeeDetails, projectId: projectId}
        );

    }

    // Function for storing employee role value in state
    const selectRoleOnChangeFunction = (e) => {

        const roleValue = e.target.value;

        setEmployeeDetails(
            {...employeeDetails, role : roleValue}
        );

    }

    // Function for storing employee designation in state
    const designationOnChangeFunction = (e) => {

        const designationValue = e.target.value;

        setEmployeeDetails(
            {...employeeDetails, designation: designationValue}
        );

    }

    const [employeeDetails, setEmployeeDetails] = useState({
        projectId: '',
        role: '',
        designation: ''
    });

    // Function to accept users (Not Completed)
    const acceptEmployeeById = async (id) => {

        const userId = id;

        if ( employeeDetails.projectId !== "" && employeeDetails.projectId !== "Select Project" && employeeDetails.role !==  "" && employeeDetails.role !== "Select Role" && employeeDetails.designation !== ""){

            try{

                const response = await axios.post(`http://localhost:7777/api/v1/accenture-admin/acceptEmployeeById/${userId}`, employeeDetails, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                })

                if ( response.status === 200 ){

                    toast.success(`Employee Accepted`, {
                        duration: 1000
                    });

                    fetchLockedUsers();

                }

            }catch(error){

                handleFetchError(error);

            }

        } else {

            toast.error('Fill all fields', {
                duration: 2000
            })

        }

    }

    // Function to delete users (Not Completed)
    const deleteEmployeeById = async (id) => {
 
        const userId = id;

        try{

            const response = await axios.delete(`http://localhost:7777/api/v1/accenture-admin/deleteEmployeeById/${userId}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                fetchLockedUsers();

                toast.success('Employee Deleted', {
                    duration: 1000
                })

            }

        }catch(error){

            handleFetchError(error);

        }

    }

    // Handle errors
    const handleFetchError = (error) => {
        
        if (error.response) {
        
            if (error.response.status === 403) {
        
                console.log(error.response.data);
        
                // Cookies.remove('access_token');
        
                // window.open('http://localtest.me:7778', '_self');
        
            } else {
        
                console.log(error);
        
            }
        
        } else {
        
            console.error('Error fetching data', error);
        
        }
    
    };

    useEffect(() => {
        
        if (!access_token) {
        
            // window.open('http://localtest.me:7778', '_self');
        
        } else {
        
            setUserRoleFunction();
        
            fetchLockedUsers();

            fetchAllProjects();

        }

    }, [access_token]);

    return (
        <>
            <Helmet>
                <title> Employee Approvals | Accenture </title>
                <meta name="description" content={`Link Pulse Dashboard where users perform their activities`} />
                <meta name="keywords" content="User Profile, Project Management, John Doe, Employee Details, Urlify, Employee Approval Urlify" />
                <meta property="og:type" content="website" />
            </Helmet>

            <Toaster />

            {role === admin && (
                <>
                    <div className="">

                        <div className="block mx-10 bg-white p-5">

                           <div className="w-full flex justify-between">

                            <div className="text-xl tracking-wide">

                                <span className='font-semibold'>Employee Approvals</span> | Showing pending employee requests

                            </div>

                            <div className="inline-flex mr-2 mb-5 font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded-lg space-x-2 cursor-pointer"
                                    onClick={refreshButtonFunction}
                                >

                                    <span>Refresh</span>

                                    <BiRefresh 
                                        className={`text-2xl ${refreshAnimationState}`} 
                                    />

                                </div>

                           </div>

                            <table className='bg-gray-200 rounded-t-xl w-full text-left'>
                                <thead>
                                    <tr
                                        className='leading-[50px] text-gray-600'
                                    >
                                        <th
                                            className='px-10'
                                        >S.No</th>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Projects</th>
                                        <th>Roles</th>
                                        <th>Designation</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {lockedUsers && lockedUsers.length > 0 && lockedUsers.map((lockedUser, index) => {

                                        return (
                                            <tr 
                                                key={lockedUser.id}
                                                className='leading-[50px] bg-white text-gray-700'
                                            >
                                                <td
                                                    className='px-10'
                                                >{(page * pageSize) + (index + 1)}</td>
                                                <td>{lockedUser.fullName}</td>
                                                <td>{lockedUser.email}</td>
                                                <td>
                                                    
                                                    <select
                                                        className='focus:outline-none bg-gray-200 px-2 py-1 rounded-lg cursor-pointer'
                                                        onChange={projectIdOnChangeFunction}  
                                                    >
                                                        <option>Select Project</option>
                                                        
                                                        {projectData && projectData.length > 0 && projectData.map((project) => (
                                                        
                                                            <option 
                                                                key={project.id} 
                                                                value={project.id}
                                                            >{project.projectName}</option>
                                                        
                                                        ))}

                                                    </select>

                                                </td>
                                                <td>
                                                    <select
                                                        className='focus:outline-none bg-gray-200 px-2 py-1 rounded-lg cursor-pointer'
                                                        onChange={selectRoleOnChangeFunction}
                                                    >
                                                        <option>Select Role</option>
                                                        
                                                        {!projectManagerAvailable && !projectError && (

                                                            <option value={`PROJECTMANAGER`}>Project Manager</option>

                                                        )}

                                                        {!projectError && (

                                                            <>

                                                                <option value={`TEAMLEAD`}>Team Lead</option>
                                                                <option value={`TEAMMEMBER`}>Team Member</option>

                                                            </>

                                                        )}
                                                        
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="leading-7 rounded-sm focus:outline-none border-[1px] border-gray-500 px-2"
                                                        onChange={designationOnChangeFunction}
                                                    />
                                                </td>
                                                <td className="flex items-center space-x-3 pt-3">
                                                    <SiTicktick
                                                        className="text-xl cursor-pointer hover:opacity-50 active:opacity-80"
                                                        onClick={() => acceptEmployeeById(lockedUser.id)}
                                                    />
                                                    <MdOutlineDeleteForever 
                                                        className="text-2xl cursor-pointer hover:opacity-50 active:opacity-80"
                                                        onClick={() => deleteEmployeeById(lockedUser.id)} 
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {lockedUsers && lockedUsers.length === 0 && (

                                        <tr
                                            className='leading-[50px] bg-white text-gray-600'
                                        >

                                            <td
                                                className='px-10'
                                            >No Data</td>
                                            <td>No Data</td>
                                            <td>No Data</td>
                                            <td>No Data</td>
                                            <td>No Data</td>
                                            <td>No Data</td>
                                            <td>No Data</td>

                                        </tr>

                                    )}
                                </tbody>
                            </table>

                            {lockedUsers && lockedUsers.length > 0 && (

                                <div className="space-x-5 text-center mx-10 mt-5 text-gray-600">
                                    
                                    <button 
                                        onClick={prevPage} 
                                        className='bg-gray-200 cursor-pointer px-2 py-2 text-xs rounded-md hover:opacity-80 active:opacity-60 mt-14'
                                    ><FaArrowLeft /></button>
                                    
                                    <span className='bg-gray-200 px-2 py-2 text-sm rounded-md'>Page {page + 1}</span>
                                     
                                    <button 
                                        onClick={nextPage}
                                        className='bg-gray-200 cursor-pointer px-2 py-2 text-xs rounded-md hover:opacity-80 active:opacity-60'
                                    ><FaArrowRight /></button>
                                
                                </div>

                            )}

                        </div>
                    </div>
                </>
            )}

        </>
    );
};

export default AdminEmployeeApproval;
