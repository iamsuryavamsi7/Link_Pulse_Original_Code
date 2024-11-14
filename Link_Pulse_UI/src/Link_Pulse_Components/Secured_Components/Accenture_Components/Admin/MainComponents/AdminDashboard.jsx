import React from 'react'
import { Helmet } from 'react-helmet-async'

const AdminDashboard = () => {

    return (

        <>
        
            <Helmet>
                <title> Admin Dashboard | Accenture </title>
                <meta name="description" content={`Link Pulse Dashboard where users perform their activities`} />
                <meta name="keywords" content="User Profile, Project Management, John Doe, Employee Details, Urlify, Employee Approval Urlify" />
                <meta property="og:type" content="website" />
            </Helmet>

            <div className="">

                Dashboard

            </div>

        </>

    )

}

export default AdminDashboard 