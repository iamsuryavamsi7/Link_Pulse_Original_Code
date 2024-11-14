import React from 'react'
import NavBar from './NavBar/NavBar'
import { Outlet } from 'react-router-dom'
import AdminLeftNavBar from './LeftNavBar/AdminLeftNavBar'

const Accenture_Admin_Layout = () => {

    return (

        <>
        
            <NavBar />
            <AdminLeftNavBar />
            <div className="pl-[265px] pt-[120px] w-full">

                <Outlet />

            </div>

        </>

    )

}

export default Accenture_Admin_Layout