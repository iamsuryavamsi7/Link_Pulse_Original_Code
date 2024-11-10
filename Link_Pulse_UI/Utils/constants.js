import { AccentureRouter, AppRouter } from "../src/AppRouter";

export const APPS = [
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