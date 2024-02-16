import React, { useEffect, useRef } from 'react';
import { authRoutingPrefix } from "../routing/constants";
import { useLocation, useNavigate } from 'react-router-dom';

const app1Basename = `/${authRoutingPrefix}`;

const AuthRemoteApp = ({ mount, store }: { mount: any, store: any }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const app1NavigationEventHandler = (event: Event) => {
            const pathname = (event as CustomEvent<string>).detail;
            const newPathname = `${app1Basename}${pathname}`;
            if (newPathname === location.pathname) {
                return;
            }
            navigate(newPathname);
        };
        window.addEventListener("[app1] navigated", app1NavigationEventHandler);

        window.addEventListener('SingleSignOn', (event: any) => {
            navigate(event.detail.url)
        })

        return () => {
            window.removeEventListener(
                "[app1] navigated",
                app1NavigationEventHandler
            );
        };
    }, [location]);

    // Listen for shell location changes and dispatch a notification.
    useEffect(
        () => {
            if (location.pathname.startsWith(app1Basename)) {
                window.dispatchEvent(
                    new CustomEvent("[shell] navigated", {
                        detail: location.pathname.replace(app1Basename, ""),
                    })
                );
            }
        },
        [location],
    );

    const isFirstRunRef = useRef(true);
    const unmountRef = useRef(() => { });
    // Mount app1 MFE
    useEffect(
        () => {
            if (!isFirstRunRef.current) {
                return;
            }
            unmountRef.current = mount({
                store: store,
                mountPoint: wrapperRef.current!,
                initialPathname: location.pathname.replace(
                    app1Basename,
                    ''
                ),
            });
            isFirstRunRef.current = false;
        },
        [location],
    );

    useEffect(() => unmountRef.current, []);

    return <div ref={wrapperRef} id="app1-mfe" />;
}

export default AuthRemoteApp