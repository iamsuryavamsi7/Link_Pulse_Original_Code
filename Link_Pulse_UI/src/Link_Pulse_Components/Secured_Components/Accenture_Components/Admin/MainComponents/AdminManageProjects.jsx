import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteForever } from 'react-icons/md';
import { Toaster, toast } from 'react-hot-toast'; 
import { Helmet } from 'react-helmet-async';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { GoPlus } from 'react-icons/go';

const AdminManageProjects = () => {

    // JWT_TOKEN
    const access_token = Cookies.get('accenture_access_token');

    // Role to store the data
    const [role, setRole] = useState();

    // Admin role value
    const admin = 'ADMIN';

    const [projectData, setProjectData] = useState();

    const [showAddProject, setShowAddProject] = useState(false);

    const [editButtonVisible, setEditButtonVisible] = useState({});

    const [deleteButtonVisible, setDeleteButtonVisible] = useState({});

    // default page number
    const [page, setPage] = useState(0); // Track the current page
    
    // Default no of items for page
    const pageSize = 10; 

    // Checking its the last page or not
    const [isLastPage, setIsLastPage] = useState(false); // 

    // Function for checking projects are available for next page
    const checkIfProjectsAreAvailable = async (pageNumber) => {

        const page = pageNumber;

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/accenture-admin/fetchProjectsData/${page}/${pageSize}`, {
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

            const response = await checkIfProjectsAreAvailable(pageNumber);

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

    // State to store add projects form details
    const [projectDetails, setProjectDetails] = useState({
        projectName: "",
        projectDescription: ""
    });

    // State to store edit projects form details
    const [formData, setFormData] = useState({
        id: "",
        projectName: "",
        projectDescription: "",
        projectCreatedOn: "",
    });

    // State to activate and deactive edit mode
    const [editMode, setEditMode] = useState(false);

    // Functions to enable edit tooltip visibility
    const enableEditVisible = (id) => {
        setEditButtonVisible((prev) => ({ ...prev, [id]: true }));
    };

    // Functions to disable edit tooltip visibility
    const disableEditVisible = (id) => {
        setEditButtonVisible((prev) => ({ ...prev, [id]: false }));
    };

    // Functions to enable delete tooltip visibility
    const enableDeleteVisible = (id) => {
        setDeleteButtonVisible((prev) => ({ ...prev, [id]: true }));
    };

    // Functions to disable delete tooltip visibility
    const disableDeleteVisible = (id) => {
        setDeleteButtonVisible((prev) => ({ ...prev, [id]: false }));
    };

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

    const addProjectButtonFunction = () => {

        if ( showAddProject ) {

            setShowAddProject(false);

        } else {

            setShowAddProject(true);

        }

    }

    const addProjectFunction = async () => {

        try{

            const response = await axios.post('http://localhost:7777/api/v1/accenture-admin/addProject', projectDetails, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                console.log(response.data);

                fetchProjectsData();

                setProjectDetails({
                    projectName: "",
                    projectDescription: ""
                });

                setShowAddProject(false);

            }

        }catch(error){

            handleFetchError(error);

        }
        
    }

    const handleOnChangeFunction = (e) => { 

        e.preventDefault();

        const value = e.target.value;

        setProjectDetails({...projectDetails, [e.target.name]: value});

    }

    // Function to store the data in state onChange for edit mode details
    const handleOnChangeFunction2 = (e) => {

        const value = e.target.value;

        setFormData({...formData, [e.target.name]: value});

    }

    // Function to delete project by id
    const projectDeleteFunction = async (id) => {

        const projectId = id;

        try{

            const response = await axios.delete(`http://localhost:7777/api/v1/accenture-admin/deleteProjectById/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                toast.success('Project Deleted Successfully', {
                    duration: 1000
                });

                fetchProjectsData();

            }

        }catch(error){

            if ( error.response.status === 403 ){

                console.log(error.response.data);
                
            }

        }

    }

    // Function to fetch project data by id then enabling edit mode
    const editButtonManageProject = async (id) => {

        const projectId = id;

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/accenture-admin/getProjectById/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const responseData = response.data;

                setEditMode(true);

                setFormData(responseData);

            }

        }catch(error){

            handleFetchError(error);

        }

    }

    const cancelButtonFunction = (e) => {

        e.preventDefault();

        setEditMode(false);

    }

    // Function to update project data in DB
    const editProjectFunction = async (e) => {

        e.preventDefault();

        const projectId = formData.id;
        const projectName = formData.projectName
        const projectDescription = formData.projectDescription

        if ( projectName !== '' && projectName !== null && projectDescription !== '' && projectDescription !== null ){

            try{

                const response = await axios.put(`http://localhost:7777/api/v1/accenture-admin/updateProject/${projectId}`, {
                    projectName: projectName,
                    projectDescription: projectDescription
                }, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })

                if ( response.status === 200 ){

                    toast.success('Project Updated', {
                        duration: 1000
                    })

                    fetchProjectsData();

                    setEditMode(false);

                }

            }catch(error){

                handleFetchError(error);

            }

        } else {

            toast.error(`Fill all fields`, {
                duration: 2000
            });

        }

    }

    const fetchProjectsData = async () => {

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/accenture-admin/fetchProjectsData/${page}/${pageSize}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                setProjectData(response.data);

                console.log(response.data);

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

        setRoleFunction();

    });

    useEffect(() => {

        fetchProjectsData();

    }, [page]);

    return (

        <>

            <Toaster />

            <Helmet>
                <title> Admin Manage Projects | Accenture </title>
                <meta name="description" content={`Link Pulse Dashboard where users perform their activities`} />
                <meta name="keywords" content="User Profile, Project Management, John Doe, Employee Details, Urlify, Employee Approval Urlify" />
                <meta property="og:type" content="website" />
            </Helmet>

            {role === admin && (

            <>

                {editMode && (

                    <div className="fixed z-50 top-0 bottom-0 left-0 right-0 flex justify-center items-center">

                        <div className="bg-white border-2 border-gray-200 px-10 rounded-xl py-10">

                            <form
                                className='space-y-5'
                                onSubmit={(e) => editProjectFunction(e)}
                            >

                                <div className="text-xl text-gray-600">

                                    Edit Project

                                </div>

                                <div className="">

                                    <label className='text-gray-600'> Project name <span className='text-red-500'>*</span> </label><br />

                                    <input 
                                        type='text'
                                        className='focus:outline-none border-2 focus:border-sky-300 rounded-lg px-3 leading-8 mt-2'
                                        name='projectName'
                                        value={formData.projectName}
                                        onChange={(e) => handleOnChangeFunction2(e)}
                                    />

                                </div>


                                <div className="">

                                    <label className='text-gray-600'> Project Desc <span className='text-red-500'>*</span> </label><br />

                                    <input 
                                        type='text'
                                        className='focus:outline-none border-2 focus:border-sky-300 rounded-lg px-3 leading-8 mt-2'
                                        name='projectDescription'
                                        value={formData.projectDescription}
                                        onChange={(e) => handleOnChangeFunction2(e)}
                                    />

                                </div>

                                <div className="flex">

                                    <button
                                        className='bg-customBlueLinkPulseBase text-white focus:outline-none font-semibold mx-3 px-2 py-1 rounded-md text-lg hover:opacity-60 active:opacity-80'
                                        type='submit'
                                    >Save</button>

                                    <button
                                        className='mx-3 px-2 py-1 rounded-md text-lg text-gray-600 font-semibold hover:opacity-60 active:opacity-80'
                                        onClick={(e) => cancelButtonFunction(e)}
                                    >Cancel</button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

                <div className="">

                <div className="flex items-center z-0">

                    <div className="bg-white px-5 py-5 mr-10 flex w-full mb-20">

                        <div className="space-y-3 block w-full">

                            <div className="text-xl tracking-wider">

                            <span className='font-semibold'>Projects</span> | Showing all active projects

                            </div>

                            <div className="flex space-x-5">

                                <div className="inline-flex text-gray-600 border-dotted border-2 border-gray-500 rounded-xl px-2 py-1 items-center space-x-1 hover:opacity-70 transition-all duration-300 active:opacity-40 cursor-pointer my-2"
                                    onClick={addProjectButtonFunction}
                                >

                                    <div className="text-xl font-serif"
                                    >

                                        <GoPlus
                                            className='text-2xl'
                                        />

                                    </div>

                                    <div className="text-sm font-serif">

                                        Add Project

                                    </div>

                                </div>

                                {showAddProject && (

                                    <div className="flex items-center space-x-5">

                                        <div className="flex items-center space-x-5 transition-all">

                                            <label  className='text-sm text-gray-600  font-semibold'>Project Name</label> <br />

                                            <input 
                                                type='text'
                                                className='focus:outline-none focus:border-customBlueLinkPulseBase border-2 rounded-xl px-2 leading-8'
                                                placeholder='Enter Project Name'
                                                name='projectName'
                                                value={projectDetails.projectName}
                                                onChange={(e) => handleOnChangeFunction(e)}
                                            />

                                        </div>

                                        <div className="flex items-center space-x-5 transition-all">

                                            <label className='text-sm text-gray-600 font-semibold'>Project Description</label> <br />

                                            <input 
                                            type='text'
                                            className='focus:outline-none focus:border-customBlueLinkPulseBase border-2  rounded-xl px-2 leading-8'
                                            placeholder='Enter Project Description'
                                            name='projectDescription'
                                            value={projectDetails.projectDescription}
                                            onChange={(e) => handleOnChangeFunction(e)}
                                            />

                                        </div>

                                        <div className="">

                                            <button
                                                className='bg-gray-200 text-gray-600 hover:opacity-80 active:opacity-60 px-3 leading-[32px] rounded-lg text-sm font-semibold'
                                                onClick={addProjectFunction}
                                            >

                                                Add Project

                                            </button>

                                        </div>

                                    </div>

                                )}

                            </div>

                            <table
                                className='w-full bg-gray-200 text-gray-600 rounded-t-lg'
                            >

                                <thead
                                    className='text-left leading-[50px]'
                                >

                                    <tr
                                        className=''
                                    >

                                        <th
                                            className='px-5'
                                        >S.No</th>
                                        <th
                                            className='px-5'
                                        >Project Name</th>
                                        <th>Project Description</th>
                                        <th
                                            className='px-5'
                                        >Created On</th>
                                        <th
                                            className='px-8'
                                        >Actions</th>

                                    </tr>

                                </thead>

                                {projectData && projectData.length === 0 && (

                                    <tbody>

                                        <tr
                                            className='bg-white text-black shadow-lg leading-[50px]'
                                        >

                                            <td
                                                className='px-5'
                                            >No Data Found</td>
                                            <td
                                                className='px-5'
                                            >No Data Found</td>
                                            <td>No Data Found</td>
                                            <td
                                                className='px-5'
                                            >No Data Found</td>
                                            <td
                                                className='px-5'
                                            >No Data Found</td>

                                        </tr>

                                    </tbody>

                                )}

                                <tbody>


                                    {projectData && projectData.length > 0 && (
                                        
                                        projectData.map((project, index) => (
                                        
                                            <tr
                                                key={project.id}
                                                className='bg-white leading-[50px] text-gray-700'
                                            >
                                        
                                                <td
                                                    className='px-5'
                                                >{(page * pageSize) + (index + 1)}</td>

                                                <td className='px-5'>{project.projectName}</td>
                                        
                                                <td
                                                    className='w-[300px] flex overflow-hidden'
                                                >{project.projectDescription}</td>
                                        
                                                <td className='px-5'>{new Date(project.projectCreatedOn).toLocaleString()}</td>
                                        
                                                <td className='px-5 space-x-5 flex items-center'>
                                        
                                                    <span className="mt-2 relative">
                                                        <CiEdit
                                                            className='text-[35px] bg-gray-200 rounded-[50%] p-1 cursor-pointer hover:opacity-60 active:opacity-80'
                                                            onMouseEnter={() => enableEditVisible(project.id)}
                                                            onMouseLeave={() => disableEditVisible(project.id)}
                                                            onClick={() => editButtonManageProject(project.id)}
                                                        />
                                                        
                                                        {editButtonVisible[project.id] && (
                                                            <span className="absolute left-[-30px] top-1 text-xs rounded-md px-1 py-1">
                                                                Edit
                                                            </span>
                                                        )}
                                        
                                                    </span>

                                                    <span className="mt-2 relative manageProjects">
                                                        <MdDeleteForever 
                                                            className='text-[35px] bg-gray-200 rounded-[50%] p-1 cursor-pointer hover:opacity-60 active:opacity-80'
                                                            onMouseEnter={() => enableDeleteVisible(project.id)}
                                                            onMouseLeave={() => disableDeleteVisible(project.id)}
                                                            onClick={() => projectDeleteFunction(project.id)}
                                                        />

                                                        {deleteButtonVisible[project.id] && (
                                                            <span className="absolute right-[-50px] top-1 text-xs rounded-md px-1 py-1">
                                                                Delete
                                                            </span>
                                                        )}
                                                    </span>
                                        
                                                </td>
                                        
                                            </tr>
                                        
                                        ))
                                    )}

                                </tbody>


                            </table>

                            {projectData && projectData.length > 0 && (

                                <div className="space-x-5 text-center text-gray-600">
                                    
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

                    </div>

                </div>

            </>

            )}

        </> 

    )

}

export default AdminManageProjects