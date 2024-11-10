import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import { CiEdit } from 'react-icons/ci';
import { MdAddBox, MdDeleteForever } from 'react-icons/md';
import { Toaster, toast } from 'react-hot-toast';

const ManageProjects = () => {

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

    const [page, setPage] = useState(0); // Track the current page
    
    const pageSize = 10; 

    const [isLastPage, setIsLastPage] = useState(false); // 

    const nextPage = async () => {

        if ( !isLastPage ) {

            const hasPage = await fetchProjectsData(page + 1);

            if ( hasPage ){

                setPage((prevPage) => prevPage + 1);

            }

        }

    }

    const prevPage = () => {

        if ( page > 0 ) {

            setPage((prevPage) => prevPage - 1);

            setIsLastPage(false);

        } 

    }

    const [projectDetails, setProjectDetails] = useState({
        projectName: "",
        projectDescription: ""
    });

    const [formData, setFormData] = useState({
        id: "",
        projectName: "",
        projectDesc: "",
        projectCreatedOn: "",
    });

    const [editMode, setEditMode] = useState(false);

    const enableEditVisible = (id) => {
        setEditButtonVisible((prev) => ({ ...prev, [id]: true }));
    };

    const disableEditVisible = (id) => {
        setEditButtonVisible((prev) => ({ ...prev, [id]: false }));
    };

    // Functions to enable/disable delete tooltip visibility
    const enableDeleteVisible = (id) => {
        setDeleteButtonVisible((prev) => ({ ...prev, [id]: true }));
    };

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

            const response = await axios.post('http://localhost:7777/api/v1/admin/addProject', projectDetails, {
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

    const handleOnChangeFunction2 = (e) => {

        e.preventDefault();

        const value = e.target.value;

        setFormData({...formData, [e.target.name]: value});

    }

    const deleteButtonFunctionManage = async (e, id) => {

        e.preventDefault();

        try{

            const response = await axios.delete('http://localhost:7777/api/v1/projects/deleteProject/' + id, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                console.log(response.data);

                fetchProjectsData();

            }

        }catch(error){

            if ( error.response.status === 403 ){

                console.log(error.response.data);
                
            }

        }

    }

    const editButtonManageProject = async (e, id) => {

        e.preventDefault();

        try{

            const response = await axios.get('http://localhost:7777/api/v1/projects/getProjectById/' + id, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                setEditMode(true);

                setFormData(response.data);

            }

        }catch(error){

            if ( error.response ){

                if ( error.response.status = 200 ){

                    console.log(error.response.data);

                }

            }

        }

    }

    const cancelButtonFunction = (e) => {

        e.preventDefault();

        setEditMode(false);

    }

    const formSubmitFunction = async (e) => {

        e.preventDefault();

        try{

            const response = await axios.put('http://localhost:7777/api/v1/projects/updateProject/' + formData.id, {
                projectName: formData.projectName,
                projectDescription: formData.projectDesc
            }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                console.log("Updated Form Data")

                fetchProjectsData();

                setEditMode(false);

            }

        }catch(error){

            if ( error.response ){

                if ( error.response.status === 403 ){

                    console.log(error.response.data);

                } else {

                    console.log(error.message);

                }

            }

        }

    }

    const fetchProjectsData = async () => {

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/admin/fetchProjectsData/${page}/${pageSize}`, {
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

    const setRoleFunction = async () => {

        try{

            const response = await axios.get('http://localhost:7777/api/v1/admin/fetchUserObject', {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if ( response.status === 200 ){

                const userData = response.data;

                console.log(userData);

                setRole(userData.role);

            }

        }catch(error){

            handleFetchError(error);

        }

    }

    useEffect(() => {

        setRoleFunction();

        fetchProjectsData();

    }, [page]);

    return (

        <>

            <Toaster />

            {role === admin && (

            <>

                {editMode && (

                    <div className="fixed z-50 top-0 bottom-0 left-0 right-0 flex justify-center items-center">

                        <div className="bg-gray-300 px-10 rounded-xl py-10  font-serif">

                            <form
                                className='space-y-5'
                                onSubmit={(e) => formSubmitFunction(e)}
                            >

                                <div className="text-xl">

                                    Edit Project

                                </div>

                                <div className="">

                                    <label> Project name </label><br />

                                    <input 
                                        type='text'
                                        className='focus:outline-none border-2 border-sky-300 rounded-lg px-3 leading-8 mt-2'
                                        name='projectName'
                                        value={formData.projectName}
                                        onChange={(e) => handleOnChangeFunction2(e)}
                                    />

                                </div>


                                <div className="">

                                    <label> Project Desc </label><br />

                                    <input 
                                        type='text'
                                        className='focus:outline-none border-2 border-sky-300 rounded-lg px-3 leading-8 mt-2'
                                        name='projectDesc'
                                        value={formData.projectDesc}
                                        onChange={(e) => handleOnChangeFunction2(e)}
                                    />

                                </div>

                                <div className="flex">

                                    <button
                                        className='bg-green-400 mx-3 px-2 py-1 rounded-md text-sm font-semibold hover:opacity-60 active:opacity-80'
                                        type='submit'
                                    >Save</button>

                                    <button
                                        className='bg-red-400 mx-3 px-2 py-1 rounded-md text-sm font-semibold hover:opacity-60 active:opacity-80'
                                        onClick={(e) => cancelButtonFunction(e)}
                                    >Cancel</button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

                <div className="pl-[300px] pt-[100px] mr-5">

                    <div className="text-2xl font-serif">

                        Manage Projects

                    </div>

                <div className="flex items-center z-0">

                    <div className="bg-white px-5 mt-5 py-5 mr-10 flex w-full mb-20">

                        <div className="space-y-3 block w-full">

                            <div className="text-xl font-serif">

                            Current Projects

                            </div>

                            <table
                                className='w-full bg-gray-800 text-white rounded-t-lg'
                            >

                                <thead
                                    className='text-left leading-[50px]'
                                >

                                    <tr>

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
                                                className='bg-white text-black shadow-lg leading-[50px]'
                                            >
                                        
                                                <td
                                                    className='px-5'
                                                >{(page * pageSize) + (index + 1)}</td>

                                                <td className='px-5'>{project.projectName}</td>
                                        
                                                <td>{project.projectDescription}</td>
                                        
                                                <td className='px-5'>{new Date(project.projectCreatedOn).toDateString()}</td>
                                        
                                                {/* <td className='px-5 space-x-5 flex items-center'>
                                        
                                                    <span className="mt-2 relative z-0">
                                                        <CiEdit
                                                            className='text-[35px] z-0 bg-gray-200 rounded-[50%] p-1 cursor-pointer hover:opacity-60 active:opacity-80'
                                                            onMouseEnter={() => enableEditVisible(project.id)}
                                                            onMouseLeave={() => disableEditVisible(project.id)}
                                                            onClick={(e) => editButtonManageProject(e, project.id)}
                                                        />
                                                        
                                                        {editButtonVisible[project.id] && (
                                                            <span className="absolute z-0 left-[-30px] top-1 text-xs rounded-md px-1 py-1">
                                                                Edit
                                                            </span>
                                                        )}
                                        
                                                    </span>

                                                    <span className="mt-2 relative z-0">
                                                        <MdDeleteForever 
                                                            className='text-[35px] z-0 bg-gray-200 rounded-[50%] p-1 cursor-pointer hover:opacity-60 active:opacity-80'
                                                            onMouseEnter={() => enableDeleteVisible(project.id)}
                                                            onMouseLeave={() => disableDeleteVisible(project.id)}
                                                            onClick={(e) => deleteButtonFunctionManage(e, project.id)}
                                                        />

                                                        {deleteButtonVisible[project.id] && (
                                                            <span className="absolute z-0 right-[-50px] top-1 text-xs rounded-md px-1 py-1">
                                                                Delete
                                                            </span>
                                                        )}
                                                    </span>
                                        
                                                </td> */}

                                                <td className='px-5 space-x-5 flex items-center'>
                                        
                                                    <span className="mt-2 relative">
                                                        <CiEdit
                                                            className='text-[35px] bg-gray-200 rounded-[50%] p-1 cursor-pointer hover:opacity-60 active:opacity-80'
                                                            onMouseEnter={() => enableEditVisible(project.id)}
                                                            onMouseLeave={() => disableEditVisible(project.id)}
                                                            onClick={(e) => editButtonManageProject(e, project.id)}
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
                                                            onClick={(e) => deleteButtonFunctionManage(e, project.id)}
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

                            <div className="space-x-5 text-center mx-10 mt-5 text-white">
                                
                                <button 
                                    onClick={prevPage} 
                                    disabled={page === 0}
                                    className='bg-gray-800 cursor-pointer px-2 py-2 text-xs rounded-md hover:opacity-80 active:opacity-60'
                                >Previous</button>
                                
                                <span className='bg-gray-800 px-2 py-2 text-sm rounded-md'>Page {page + 1}</span>
                                
                                <button 
                                    onClick={nextPage}
                                    className='bg-gray-800 cursor-pointer px-2 py-2 text-xs rounded-md hover:opacity-80 active:opacity-60'
                                >Next</button>
                            
                            </div>

                            <div className="inline-flex items-center space-x-1 hover:opacity-70 transition-all duration-300 active:opacity-40 cursor-pointer"
                                onClick={addProjectButtonFunction}
                            >

                                <div className="text-xl font-serif"
                                >

                                    <MdAddBox
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

                                        <label  className='text-sm font-semibold'>Project Name</label> <br />

                                        <input 
                                            type='text'
                                            className='focus:outline-none bg-gray-100 border-sky-500 border-2 rounded-md px-5 leading-[20px]'
                                            placeholder='Enter Project Name'
                                            name='projectName'
                                            value={projectDetails.projectName}
                                            onChange={(e) => handleOnChangeFunction(e)}
                                        />

                                    </div>

                                    <div className="flex items-center space-x-5 transition-all">

                                        <label className='text-sm font-semibold'>Project Description</label> <br />

                                        <input 
                                        type='text'
                                        className='focus:outline-none  bg-gray-100 border-sky-500 border-2 rounded-md px-5 leading-[0px]'
                                        placeholder='Enter Project Description'
                                        name='projectDescription'
                                        value={projectDetails.projectDescription}
                                        onChange={(e) => handleOnChangeFunction(e)}
                                        />

                                    </div>

                                    <div className="">

                                        <button
                                            className='bg-green-400 px-3 leading-[32px] rounded-lg text-sm font-semibold'
                                            onClick={addProjectFunction}
                                        >

                                            Add Project

                                        </button>

                                    </div>

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

export default ManageProjects