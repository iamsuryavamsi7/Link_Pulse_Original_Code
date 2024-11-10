import { APPS } from "./constants"

export const getApp = () => {
    
    // console.log(window.location.hostname);

    const subdomain = getSubdomain(window.location.hostname);

    // console.log(subdomain);

    const mainApp = APPS.find((app) => {

        return app.main;

    })

    if ( subdomain === "") {

        return mainApp.app

    }

    const app = APPS.find((app) => {

        return subdomain === app.subdomain

    })

    if ( !app ) {

        return mainApp.app;

    } else {

        return app.app;

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


// const getSubdomain = (hostname) => { // connekt.in ['connekt', 'in'] admin.localhost:7778/login linkpulse.in:8080/login
//     // Split the hostname into parts
//     const locationParts = hostname.split('.'); // Change this line to use '.' as the separator

//     let sliceTill = -2;

//     // Check for localhost
//     const isLocalHost = locationParts.includes("localhost"); // Use includes to check for 'localhost'

//     if (isLocalHost) {
        
//         sliceTill = -1;

//     }

//     // Join the parts, ensuring to account for different cases
//     return locationParts.slice(0, sliceTill).join('.');
// }

