import React, { Suspense, useEffect, useState } from "react";
import { Navigate, RouteObject, useNavigate } from "react-router-dom";
import { authRoutingPrefix, documentManagerRoutingPrefix, collectRoutingPrefix } from "./constants";
import { FaAngleDoubleRight } from "react-icons/fa";

import AuthRemoteApp from '../remoteApps/AuthRemoteApp';
import DocumentRemoteApp from '../remoteApps/documentRemoteApp';
import CollectRemoteApp from "../remoteApps/collectRemoteApp";
import { mount as AuthMount } from "singleSignOn/authApp"
import { mount as DocumentMount } from "documentManager/documentApp"
import { mount as CollectMount } from "collect/collectApp"

import { store } from '../store/index';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { userService } from "singleSignOn/UserService";
import Breadcrumbs from "../components/Breadcrumbs/Breadcrumbs";

class ErrorBoundary extends React.Component {
    state: { hasError: boolean; };
    props: any;
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.log(error, errorInfo)
        // You can also log the error to an error reporting service
    }

    render() {
        if (this.state.hasError === true) {
            // You can render any custom fallback UI
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <div >
                        Go Back
                    </div>
                </div >
            )

        }

        return this.props.children;
    }
}

const PublicRouteHOC = ({ children }: { children: any }) => {
    const navigate = useNavigate()
    useEffect(() => {
        window.addEventListener('SingleSignOn', (event: any) => {
            console.log('[Single Sign On]', event)
            navigate(event.detail.url)
        })
        window.addEventListener('DocumentManager', (event: any) => {
            console.log('[Document Manager]', event)
            navigate(event.detail.url)
        })
    }, [])
    return <ErrorBoundary fallback={<p>Something went wrong</p>}>
        {
            userService.isLoggedIn() ?
                <Navigate to="/document_manager/my_documents" />
                : children
        }
    </ErrorBoundary>
}

const PrivateRouteHOC = ({ children }: { children: any }) => {
    const navigate = useNavigate()
    const [isClosed, setIsClosed] = useState(false)
    const handleClick = () => {
        setIsClosed((isClosed) => !isClosed)
    }
    useEffect(() => {
        window.addEventListener('SingleSignOn', (event: any) => {
            console.log('[Single Sign On]', event)
            navigate(event.detail.url)
        })
        window.addEventListener('DocumentManager', (event: any) => {
            console.log('[Document Manager]', event)
            navigate(event.detail.url)
        })
    }, [])
    return <ErrorBoundary fallback={<p>Something went wrong</p>}>
        {
            userService.isLoggedIn() ? (
                <div>
                    <div>
                        <Sidebar isClosed={isClosed} />
                    </div>
                    <section className={`home-section ${!isClosed ? 'close_sidebar' : ''} `} >
                        <div className="home-content">
                            <div className="closeHandler">
                                <FaAngleDoubleRight className="menu" size={24} onClick={handleClick} />
                            </div>
                            <Header isSidebar={true} />
                        </div>
                        <Suspense fallback={`Loading...`}>
                            <div style={{ padding: "20px", height: '100%' }}>
                                <Breadcrumbs />
                                {children}
                            </div>
                        </Suspense>
                    </section>
                    {/* top container */}

                </div>
            ) : (
                <Navigate to="/authentication/login" />
            )
        }
    </ErrorBoundary>
}

export const routes: RouteObject[] = [
    {
        path: '/',
        children: [
            {
                index: true,
                element: <Navigate to={`/${authRoutingPrefix}/login`} />,
            },
            {
                path: `/${authRoutingPrefix}/*`,
                element: <Suspense fallback="Loading Authentication...">
                    <PublicRouteHOC>
                        <AuthRemoteApp mount={AuthMount} store={store} />
                    </PublicRouteHOC>
                </Suspense>,
            },
            {
                path: `/${documentManagerRoutingPrefix}/*`,
                element:
                    <PrivateRouteHOC>
                        <DocumentRemoteApp mount={DocumentMount} store={store} />
                    </PrivateRouteHOC>
            },
            {
                path: `/${collectRoutingPrefix}/*`,
                element:
                    <PrivateRouteHOC>
                        <CollectRemoteApp mount={CollectMount} store={store} />
                    </PrivateRouteHOC>
            }
        ],
    }
];