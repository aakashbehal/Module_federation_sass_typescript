import React from 'react';
import { Outlet } from "react-router-dom";
import { NavigationManager } from "../components/NavigationManager";
import Documents from '../containers/DocumentManager/Documents';
import DocumentsList from '../containers/DocumentManager/DocumentsList';
import SummaryDrillDownHave from '../containers/DocumentManager/SummaryDrillDownHave';
import SummaryDrillDownNotHave from '../containers/DocumentManager/SummaryDrillDownNotHave';
import ClientSetup from '../containers/Setup/ClientSetup';
import PartnerSetup from '../containers/Setup/PartnerSetup';
import Approval from '../containers/Setup/Approval';
import Domain from '../containers/Setup/Domain';
import DocumentTypeIdentifier from '../containers/DocumentManager/DocumentTypeIdentifier';
import ConsoleSettings from '../containers/DocumentManager/ConsoleSettings';
import Automation from '../containers/DocumentManager/Automation';
import RequiredDocuments from '../containers/User/RequiredDocuments';
import DocumentCostConfiguration from '../containers/User/DocumentCostConfiguration';
import NamingConfigurationOthers from '../containers/User/NamingConfigurationOthers';
import DocumentGeneralConfiguration from '../containers/User/DocumentGeneralConfiguration';
import UserAccount from '../containers/User/UserAccount';

export const routes = [
    {
        path: "/",
        element: (
            <NavigationManager>
                <Outlet />
            </NavigationManager>
        ),
        children: [
            {
                index: true,
                path: 'my_documents',
                element: <Documents />,
            },
            {
                path: "sent_document_requests",
                element: <Documents />,
            },
            {
                path: "received_document_requests",
                element: <Documents />,
            },
            {
                path: "download_history",
                element: <Documents />,
            },
            {
                path: "document_list",
                element: <DocumentsList />,
            },
            {
                path: "accounts_documents",
                element: <SummaryDrillDownHave />,
            },
            {
                path: "accounts_missing_documents",
                element: <SummaryDrillDownNotHave />,
            },
            {
                path: "setup/client",
                element: <ClientSetup />,
            },
            {
                path: "setup/partner",
                element: <PartnerSetup />,
            },
            {
                path: "setup/user_approval",
                element: <Approval />,
            },
            {
                path: "setup/Domain",
                element: <Domain />,
            },
            {
                path: "setup/document_type_identifier",
                element: <DocumentTypeIdentifier />,
            },
            {
                path: "setup/console",
                element: <ConsoleSettings />,
            },
            {
                path: "automation",
                element: <Automation />,
            },
            {
                path: "profile/user_account",
                element: <UserAccount />,
            },
            {
                path: "profile/document_general_configuration",
                element: <DocumentGeneralConfiguration />,
            },
            {
                path: "profile/document_general_configuration/:id",
                element: <NamingConfigurationOthers />,
            },
            {
                path: "profile/document_cost_configuration",
                element: <DocumentCostConfiguration />,
            },
            {
                path: "profile/required_documents",
                element: <RequiredDocuments />,
            },
        ],
    },
];