import React, { useEffect, useState } from "react";
import { Col, Form, Row, Button, Tab, Tabs } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import Styles from "./DocumentManager.module.sass";
import { BsArrowsAngleContract, BsArrowsAngleExpand } from "react-icons/bs"
import MyDocuments from "./MyDocuments";
import ReceivedDocumentRequests from "./ReceivedDocumentRequests";
import SentDocumentRequests from "./SentDocumentRequests";
import DownloadHistory from "./DownloadHistory";
import { MiscActionCreator } from "../../store/actions/common/misc.actions";
import DocumentRequirement from "./DocumentRequirement";
import DocumentCoverage from "./DocumentCoverage";
import Usage from "./Usage";
import Invoice from "./Invoice";

const Documents = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapse, setCollapse] = useState(false);
    const [selectedTab, setSelectedTab] = useState('');

    useEffect(() => {
        console.log(location)
        const tab = location.pathname.split('/')
        setSelectedTab(tab[tab.length - 1])
    }, [location])


    const documentSummary = () => {
        return <Col sm={12} className="form_container">
            <Row>
                <Col sm={11}><h4 style={{ marginLeft: '1rem' }}>Document Summary</h4></Col>
                <Col sm={1} style={{ textAlign: 'right', paddingRight: '2rem', cursor: 'pointer' }} onClick={() => setCollapse((collapse) => !collapse)}>
                    {!collapse && <BsArrowsAngleContract size={20} />}
                    {collapse && <BsArrowsAngleExpand size={20} />}
                </Col>
            </Row>
            <Col sm={12} className={collapse ? Styles.collapse_summary : ''} style={{ overflowX: 'scroll' }}>
                <Row style={{ minWidth: '110%' }}>
                    <Col sm={5} >
                        <DocumentCoverage collapse={collapse} />
                    </Col >
                    <Col sm={5}  >
                        <DocumentRequirement collapse={collapse} />
                    </Col>
                    <Col sm={2} >
                        <Usage collapse={collapse} />
                        <Invoice collapse={collapse} />
                    </Col>
                </Row >
            </Col >
        </Col >
    }
    const handleSelect = (e: any) => {
        console.log(e, `/document_manager/${e}`)
        navigate({
            pathname: `/${e}`
        });
    }
    return (
        <>
            {
                documentSummary()
            }
            <br />
            <Col className="no_padding">
                <Tabs
                    activeKey={selectedTab}
                    id="fill-tab-example"
                    fill
                    className="mb-3"
                    onSelect={handleSelect}
                >
                    <Tab eventKey="my_documents" title="My Documents">
                        {(selectedTab === "my_documents" || selectedTab === "my_documents_side") && <MyDocuments />}
                    </Tab>
                    <Tab eventKey="sent_document_requests" title="Sent Document Requests">
                        {(selectedTab === "sent_document_requests" || selectedTab === "sent_document_requests_side") && <SentDocumentRequests />}
                    </Tab>
                    <Tab eventKey="received_document_requests" title="Received Document Request">
                        {(selectedTab === "received_document_requests" || selectedTab === "received_document_requests_side") && <ReceivedDocumentRequests />}
                    </Tab>
                    <Tab eventKey="download_history" title="Download History">
                        {(selectedTab === "download_history" || selectedTab === "download_history_side") && <DownloadHistory />}
                    </Tab>
                </Tabs >
            </Col >

        </>
    )
};

export default Documents