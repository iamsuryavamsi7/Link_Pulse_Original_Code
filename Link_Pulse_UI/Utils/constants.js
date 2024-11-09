import { AccentureRouter, AppRouter } from "../src/AppRouter";

// Rendering Components
const APPS = [
    {

        subdomain: "www",
        app: AppRouter,
        main: true

    },
    {

        subdomain: "accenture",
        app: AccentureRouter,
        main: false

    }
]

export { APPS };