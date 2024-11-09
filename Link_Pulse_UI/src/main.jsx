import { createRoot } from 'react-dom/client'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { getApp } from '../Utils/helpers'

const App = () => {

	const CurrentApp = getApp();

	return (

		<>
		
			<HelmetProvider>

				<BrowserRouter>
				
					<CurrentApp />
				
				</BrowserRouter>

			</HelmetProvider>

		</>

	);

}

createRoot(document.getElementById('root')).render(<App />)
