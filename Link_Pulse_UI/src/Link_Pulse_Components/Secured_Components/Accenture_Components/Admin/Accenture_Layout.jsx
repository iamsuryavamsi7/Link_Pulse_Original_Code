import React from 'react'
import NavBar from './NavBar/NavBar'
import LeftNavBar from './LeftNavBar/LeftNavBar'
import { Outlet } from 'react-router-dom'

const Accenture_Layout = () => {

    return (

        <>
        
            <NavBar />
            <LeftNavBar />
            <div className="">

                <Outlet />

            </div>

        </>

    )

}

export default Accenture_Layout