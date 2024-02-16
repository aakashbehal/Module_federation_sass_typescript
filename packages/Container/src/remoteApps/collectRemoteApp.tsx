import React, { useEffect, useRef } from 'react';
import { collectRoutingPrefix } from "../routing/constants";
import { useLocation, useNavigate } from 'react-router-dom';

const app3Basename = `/${collectRoutingPrefix}`;

const CollectRemoteApp = ({ mount, store }: { mount: any, store: any }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const app1NavigationEventHandler = (event: Event) => {
            const pathname = (event as CustomEvent<string>).detail;
            const newPathname = `${app3Basename}${pathname}`;
            if (newPathname === location.pathname) {
                return;
            }
            navigate(newPathname);
        };
        window.addEventListener("[app3] navigated", app1NavigationEventHandler);

        window.addEventListener('SingleSignOn', (event: any) => {
            navigate(event.detail.url)
        })

        return () => {
            window.removeEventListener(
                "[app3] navigated",
                app1NavigationEventHandler
            );
        };
    }, [location]);

    // Listen for shell location changes and dispatch a notification.
    useEffect(
        () => {
            if (location.pathname.startsWith(app3Basename)) {
                window.dispatchEvent(
                    new CustomEvent("[shell] navigated", {
                        detail: location.pathname.replace(app3Basename, ""),
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
                    app3Basename,
                    ''
                ),
            });
            isFirstRunRef.current = false;
        },
        [location],
    );

    useEffect(() => unmountRef.current, []);

    return <div ref={wrapperRef} id="app3-mfe" />;
}

export default CollectRemoteApp