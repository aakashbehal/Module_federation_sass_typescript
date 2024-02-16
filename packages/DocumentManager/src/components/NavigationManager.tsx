import React, { ReactElement, useEffect } from "react";
import { matchRoutes, useLocation, useNavigate } from "react-router-dom";
import { routes } from "../routing/routes";

interface NavigationManagerProps {
    children: ReactElement;
}

export interface ILocation {
    pathname: string
    search: string
    hash: string
    state: string
    key: string
}

export function NavigationManager({ children }: NavigationManagerProps) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        function shellNavigationHandler(event: Event) {
            const pathDetails = (event as CustomEvent<ILocation>).detail;
            console.log(`Listener added ----`, event, location.pathname, pathDetails.pathname, !matchRoutes(routes, { pathname: pathDetails.pathname }))
            if (location.pathname === pathDetails.pathname || !matchRoutes(routes, { pathname: pathDetails.pathname })) {
                return;
            }
            navigate({
                pathname: pathDetails.pathname,
                search: pathDetails.search
            });
        }

        window.addEventListener("[shell] navigated", shellNavigationHandler);

        return () => {
            console.log(`Inside Remove`)
            window.removeEventListener("[shell] navigated", shellNavigationHandler);
        };
    }, [location]);

    useEffect(() => {
        window.dispatchEvent(
            new CustomEvent("[app2] navigated", { detail: location })
        );
    }, [location]);

    return children;
}