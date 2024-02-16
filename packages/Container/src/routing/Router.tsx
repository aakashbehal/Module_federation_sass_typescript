import React, { useEffect } from "react";
import {
    createHashRouter,
    RouterProvider
} from "react-router-dom";
import { routes } from "./routes";

const HashRouter = createHashRouter(routes);

export function Router() {
    return (
        <RouterProvider router={HashRouter} />
    );
}