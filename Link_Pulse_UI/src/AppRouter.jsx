// App Router's for conditional redenring purpose with subdomains

import { Route, Routes } from "react-router-dom";
import Login from "./Link_Pulse_Components/Public_Components/Login";
import Register from "./Link_Pulse_Components/Public_Components/Register";

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

			

		</>

	)

};

export { AppRouter, AccentureRouter };
