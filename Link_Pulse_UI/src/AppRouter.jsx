// App Router's for conditional redenring purpose with subdomains

import { Route, Routes } from "react-router-dom";
import Login from "./Link_Pulse_Components/Public_Components/Login";
import Register from "./Link_Pulse_Components/Public_Components/Register";
import Accenture_Admin_Layout from "./Link_Pulse_Components/Secured_Components/Accenture_Components/Admin/Accenture_Admin_Layout";
import AdminDashboard from "./Link_Pulse_Components/Secured_Components/Accenture_Components/Admin/MainComponents/AdminDashboard";
import AdminManageProjects from "./Link_Pulse_Components/Secured_Components/Accenture_Components/Admin/MainComponents/AdminManageProjects";
import AdminEmployeeApproval from "./Link_Pulse_Components/Secured_Components/Accenture_Components/Admin/MainComponents/AdminEmployeeApproval";
import Accenture404NotFoundPage from "./Link_Pulse_Components/Secured_Components/Accenture_Components/404NotFound/Accenture404NotFoundPage";
import AdminProfilePage from "./Link_Pulse_Components/Secured_Components/Accenture_Components/Admin/MainComponents/AdminProfilePage";
import AdminProfileAbout from "./Link_Pulse_Components/Secured_Components/Accenture_Components/Admin/MainComponents/AdminProfileAbout";
import AdminProfileJob from "./Link_Pulse_Components/Secured_Components/Accenture_Components/Admin/MainComponents/AdminProfileJob";

// Public Pages Router
function AppRouter() {

	return (
	
		<>

			<Routes>

				<Route index element={<Login/>} />
				<Route path='/register' element={<Register />} />
				<Route path='/login' element={<Login />} />

			</Routes>

		</>

	)

};

// Secured Client 01 Accenture Router
function AccentureRouter() {

	return (
	
		<>

			<Routes>

				{/* Accenture Admin Routes */}
				<Route element={<Accenture_Admin_Layout />}>

					<Route path = "/admin-dashboard" element = {<AdminDashboard />} />
					<Route path="/admin-manage-projects" element= {<AdminManageProjects />}/>
					<Route path="/admin-employee-approvals" element= {<AdminEmployeeApproval />}/>
						
						{/* Routes for Admin Profile Page */}
					<Route element= {<AdminProfilePage />}>
						<Route path="/admin-profile-page" element={<AdminProfileAbout />}/>
						<Route path="/admin-job-page" element={<AdminProfileJob />}/>
					</Route>

				</Route>

				{/* 404 Not Found Page */}
				<Route path="*" element={<Accenture404NotFoundPage />}/>

			</Routes>

		</>

	)

};

export { AppRouter, AccentureRouter };
