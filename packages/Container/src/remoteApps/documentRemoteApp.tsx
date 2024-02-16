import React, { useEffect, useRef } from 'react';
import { documentManagerRoutingPrefix } from "../routing/constants";
import { useLocation, useNavigate } from 'react-router-dom';

export interface ILocation {
    pathname: string
    search: string
    hash: string
    state: string
    key: string
}

const app2Basename = `/${documentManagerRoutingPrefix}`;

const DocumentRemoteApp = ({ mount, store }: { mount: any, store: any }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const app1NavigationEventHandler = (event: Event) => {
            const pathDetails: ILocation = (event as CustomEvent<ILocation>).detail;
            const newPathname = `${app2Basename}${pathDetails.pathname}`;
            const newSearchParams = pathDetails.search
            if (newPathname === location.pathname) {
                return;
            }
            navigate({
                pathname: newPathname,
                search: newSearchParams
            });
        };
        window.addEventListener("[app2] navigated", app1NavigationEventHandler);

        return () => {
            window.removeEventListener(
                "[app2] navigated",
                app1NavigationEventHandler
            );
        };
    }, [location]);

    // Listen for shell location changes and dispatch a notification.
    useEffect(() => {
        if (location.pathname.startsWith(app2Basename)) {
            console.log(`Remote DM event`)
            window.dispatchEvent(
                new CustomEvent("[shell] navigated", {
                    detail: {
                        ...location,
                        pathname: location.pathname.replace(app2Basename, "")
                    },
                })
            );
        }
    }, [location]);

    const isFirstRunRef = useRef(true);
    const unmountRef = useRef(() => { });
    // Mount app1 MFE
    useEffect(() => {
        if (!isFirstRunRef.current) {
            return;
        }
        unmountRef.current = mount({
            store: store,
            mountPoint: wrapperRef.current!,
            initialPathname: location.pathname.replace(
                app2Basename,
                ''
            ),
        });
        isFirstRunRef.current = false;
    }, [location]);

    useEffect(() => unmountRef.current, []);

    return <div ref={wrapperRef} id="app2-mfe" />;
}

export default DocumentRemoteApp