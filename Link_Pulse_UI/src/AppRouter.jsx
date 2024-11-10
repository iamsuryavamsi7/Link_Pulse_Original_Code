// App Router's for conditional redenring purpose with subdomains

import { Route, Routes } from "react-router-dom";
import Login from "./Link_Pulse_Components/Public_Components/Login";
import Register from "./Link_Pulse_Components/Public_Components/Register";
import Accenture_Layout from "./Link_Pulse_Components/Secured_Components/Accenture_Components/Admin/Accenture_Layout";
import Dashboard from "./Link_Pulse_Components/Secured_Components/Accenture_Components/Admin/MainComponents/Dashboard";
import ManageProjects from "./Link_Pulse_Components/Secured_Components/Accenture_Components/Admin/MainComponents/ManageProjects";

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

				<Route element={<Accenture_Layout />}>

					<Route path = "/admin-dashboard" element = {<Dashboard />} />
					<Route path="/manage-projects" element= {<ManageProjects />}/>

				</Route>

			</Routes>

		</>

	)

};

export { AppRouter, AccentureRouter };
