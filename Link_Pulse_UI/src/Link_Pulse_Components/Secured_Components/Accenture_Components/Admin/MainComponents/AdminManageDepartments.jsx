import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteForever } from 'react-icons/md';
import { Toaster, toast } from 'react-hot-toast'; 
import { Helmet } from 'react-helmet-async';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { GoPlus } from 'react-icons/go';

const AdminManageDepartments = () => {

    // JWT_TOKEN
    const access_token = Cookies.get('accenture_access_token');

    // Role to store the data
    const [role, setRole] = useState();

    // Admin role value
    const admin = 'ADMIN';

    const [departmentData, setDepartmentData] = useState();

    const [showAddProject, setShowAddDepartment] = useState(false);

    const [editButtonVisible, setEditButtonVisible] = useState({});

    const [deleteButtonVisible, setDeleteButtonVisible] = useState({});

    // default page number
    const [page, setPage] = useState(0); // Track the current page
    
    // Default no of items for page
    const pageSize = 10; 

    // Checking its the last page or not
    const [isLastPage, setIsLastPage] = useState(false); // 

    // Function for checking projects are available for next page
    const checkIfDepartmentsAreAvailable = async (pageNumber) => {

        const page = pageNumber;

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/accenture-admin/fetchAllProjects/${page}/${pageSize}`, {
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

            const response = await checkIfDepartmentsAreAvailable(pageNumber);

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
    const [departmentDetails, setDepartmentDetails] = useState({
        departmentName: ""
    });

    // State to store edit projects form details
    const [formData, setFormData] = useState({
        id: "",
        departmentName: "",
        departmentCreatedOn: "",
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

    // Function to show add deprtment option
    const addDepartmentButtonFunction = () => {

        if ( showAddProject ) {

            setShowAddDepartment(false);

        } else {

            setShowAddDepartment(true);

        }

    }

    // Function to add departments
    const addDepartmentFunction = async () => {

        const formData = new FormData();

        formData.append('departmentName', departmentDetails.departmentName);

        try{

            const response = await axios.post('http://localhost:7777/api/v1/accenture-admin/addDepartment', formData, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                fetchDepartmentsData();

                setDepartmentDetails({
                    departmentName: ""
                });

                setShowAddDepartment(false);

                toast.success('Department Added Successful', {
                    duration: 1000
                });

            }

        }catch(error){

            handleFetchError(error);

        }
        
    }

    // Function to store the data in state onChange for add department details
    const handleOnChangeFunction = (e) => { 

        e.preventDefault();

        const value = e.target.value;

        setDepartmentDetails({...departmentDetails, [e.target.name]: value});

    }

    // Function to store the data in state onChange for edit mode details
    const handleOnChangeFunction2 = (e) => {

        const value = e.target.value;

        setFormData({...formData, [e.target.name]: value});

    }

    // Function to delete project by id
    const DepartmentDeleteFunction = async (id) => {

        const departmentId = id;

        try{

            const response = await axios.delete(`http://localhost:7777/api/v1/accenture-admin/deleteDepartmentById/${departmentId}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                toast.success('Department Deleted Successfully', {
                    duration: 1000
                });

                fetchDepartmentsData();

            }

        }catch(error){

            if ( error.response.status === 403 ){

                console.log(error.response.data);
                
            }

        }

    }

    // Function to fetch project data by id then enabling edit mode
    const editButtonManageDepartment = async (id) => {

        const departmentId = id;

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/accenture-admin/getDepartmentById/${departmentId}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                const responseData = response.data;

                setEditMode(true);

                setFormData(responseData);

                console.log(responseData);

            }

        }catch(error){

            handleFetchError(error);

        }

    }

    // Function to activate/deactive edit mode
    const cancelButtonFunction = (e) => {

        e.preventDefault();

        setEditMode(false);

    }

    // Function to update project data in DB
    const editDepartmentFunction = async (e) => {

        e.preventDefault();

        const departmentId = formData.id;
        const departmentName = formData.departmentName;

        if ( departmentName !== '' && departmentName !== null ){

            const formDataDto = new FormData();

            formDataDto.append('departmentName', departmentName);

            try{

                const response = await axios.put(`http://localhost:7777/api/v1/accenture-admin/updateDepartment/${departmentId}`, formDataDto, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })

                if ( response.status === 200 ){

                    toast.success('Project Updated', {
                        duration: 1000
                    })

                    fetchDepartmentsData();

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

    // Function to fetch all departments
    const fetchDepartmentsData = async () => {

        try{

            const response = await axios.get(`http://localhost:7777/api/v1/accenture-admin/fetchAllDepartments/${page}/${pageSize}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            if ( response.status === 200 ){

                setDepartmentData(response.data);

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

        fetchDepartmentsData();

    }, [page]);

    return (

        <>

            <Toaster />

            <Helmet>
                <title> Admin Manage Departments | Accenture </title>
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
                                onSubmit={(e) => editDepartmentFunction(e)}
                            >

                                <div className="text-xl text-gray-600">

                                    Edit Department

                                </div>

                                <div className="">

                                    <label className='text-gray-600'> Department name <span className='text-red-500'>*</span> </label><br />

                                    <input 
                                        type='text'
                                        className='focus:outline-none border-2 focus:border-sky-300 rounded-lg px-3 leading-8 mt-2'
                                        name='departmentName'
                                        value={formData.departmentName}
                                        onChange={(e) => handleOnChangeFunction2(e)}
                                    />

                                </div>

                                <div className="flex">

                                    <button
                                        className='bg-customBlueLinkPulseBase text-white font-semibold mx-3 px-2 py-1 rounded-md text-lg hover:opacity-60 active:opacity-80'
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

                            <span className='font-semibold'>Departments</span> | Showing all departments

                            </div>

                            <div className="flex space-x-5">

                                <div className="inline-flex text-gray-600 border-dotted border-2 border-gray-500 rounded-xl px-2 py-1 items-center space-x-1 hover:opacity-70 transition-all duration-300 active:opacity-40 cursor-pointer my-2"
                                    onClick={addDepartmentButtonFunction}
                                >

                                    <div className="text-xl font-serif"
                                    >

                                        <GoPlus
                                            className='text-2xl'
                                        />

                                    </div>

                                    <div className="text-sm font-serif">

                                        Add Department

                                    </div>

                                </div>

                                {showAddProject && (

                                    <div className="flex items-center space-x-5">

                                        <div className="flex items-center space-x-5 transition-all">

                                            <label  className='text-sm text-gray-600  font-semibold'>Department Name</label> <br />

                                            <input 
                                                type='text'
                                                className='focus:outline-none focus:border-customBlueLinkPulseBase border-2 rounded-xl px-2 leading-8'
                                                placeholder='Enter Department Name'
                                                name='departmentName'
                                                value={departmentDetails.departmentName}
                                                onChange={(e) => handleOnChangeFunction(e)}
                                            />

                                        </div>

                                        <div className="">

                                            <button
                                                className='bg-gray-200 text-gray-600 hover:opacity-80 active:opacity-60 px-3 leading-[32px] rounded-lg text-sm font-semibold'
                                                onClick={addDepartmentFunction}
                                            >

                                                Add Departments

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
                                        >Departments Name</th>
                                        <th
                                            className='px-5'
                                        >Created On</th>
                                        <th
                                            className='px-8'
                                        >Actions</th>

                                    </tr>

                                </thead>

                                {departmentData && departmentData.length === 0 && (

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


                                    {departmentData && departmentData.length > 0 && (
                                        
                                        departmentData.map((department, index) => (
                                        
                                            <tr
                                                key={department.id}
                                                className='bg-white leading-[50px] text-gray-700'
                                            >
                                        
                                                <td
                                                    className='px-5'
                                                >{(page * pageSize) + (index + 1)}</td>

                                                <td className='px-5'>{department.departmentName}</td>
                                        
                                                <td className='px-5'>{new Date(department.departmentCreatedOn).toLocaleString()}</td>
                                        
                                                <td className='px-5 space-x-5 flex items-center'>
                                        
                                                    <span className="mt-2 relative">
                                                        <CiEdit
                                                            className='text-[35px] bg-gray-200 rounded-[50%] p-1 cursor-pointer hover:opacity-60 active:opacity-80'
                                                            onMouseEnter={() => enableEditVisible(department.id)}
                                                            onMouseLeave={() => disableEditVisible(department.id)}
                                                            onClick={() => editButtonManageDepartment(department.id)}
                                                        />
                                                        
                                                        {editButtonVisible[department.id] && (
                                                            <span className="absolute left-[-30px] top-1 text-xs rounded-md px-1 py-1">
                                                                Edit
                                                            </span>
                                                        )}
                                        
                                                    </span>

                                                    <span className="mt-2 relative manageProjects">
                                                        <MdDeleteForever 
                                                            className='text-[35px] bg-gray-200 rounded-[50%] p-1 cursor-pointer hover:opacity-60 active:opacity-80'
                                                            onMouseEnter={() => enableDeleteVisible(department.id)}
                                                            onMouseLeave={() => disableDeleteVisible(department.id)}
                                                            onClick={() => DepartmentDeleteFunction(department.id)}
                                                        />

                                                        {deleteButtonVisible[department.id] && (
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

                            {departmentData && departmentData.length > 0 && (

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

export default AdminManageDepartments