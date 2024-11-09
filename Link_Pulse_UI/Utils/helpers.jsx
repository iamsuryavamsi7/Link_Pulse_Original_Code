import Custom404NotFoundPage from "../src/Link_Pulse_Error/Custom404NotFoundPage";
import { APPS } from "./constants";

// Function to render the router conditionally
export const getApp = () => {

    // Uncomment if needed to see the name
    // console.log(window.location.hostname);

    // Get extracted subdomain with Java Script window global object
    const subdomain = getSubdomain(window.location.hostname);

    // Iterate every elementin constants file to get the correct router
    const mainApp = APPS.find((app) => {

        return app.main;

    })

    // If there is no subdomain present then return main in APPS which is true
    if ( subdomain === "") {

        return mainApp.app

    }

    // If the subdomain equals to out APPS subdomain then return it
    const app = APPS.find((app) => {

        return subdomain === app.subdomain

    })

    // If subdomain is not found then return 404 Not Found Page
    if ( !app ) {

        return <Custom404NotFoundPage />;

    }

}

export const getSubdomain = (hostname) => {
    const locationParts = hostname.split('.');

    let sliceTill = -2;

    // Check if it's localhost or an IP address
    const isLocalHost = locationParts.includes("localhost") || 
                        hostname.match(/^(?:\d{1,3}\.){3}\d{1,3}$/); // Match IP addresses

    if (isLocalHost) {
        sliceTill = -1; // No subdomain for localhost/IP
    }

    // Join the subdomain parts, if any
    return locationParts.slice(0, sliceTill).join('.');
}


