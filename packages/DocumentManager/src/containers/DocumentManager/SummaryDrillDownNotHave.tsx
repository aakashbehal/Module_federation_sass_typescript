import React, { useState, useEffect } from "react";
import { Col, Row, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import Styles from "./DocumentManager.module.sass";
import TableComponent from "../../components/Table/Table";
import DocumentUpload from "../../components/modal/DocumentUpload";
import { MyDocumentsActionCreator } from "../../store/actions/myDocuments.actions";
import ViewDocument from "../../components/modal/ViewDocument";
import AdvanceSearch from "../../components/Common/AdvanceSearch";
import { SummaryActionCreator } from "../../store/actions/summary.actions";
import AdvanceSearchHook from "../../components/CustomHooks/AdvanceSearchHook";
import { MiscActionCreator } from "../../store/actions/common/misc.actions";
import { useLocation } from "react-router-dom";

const SummaryDrillDownNotHave = () => {
    const dispatch = useDispatch();
    const location = useLocation()

    const [params, setParams] = useState<any>()
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [sortElement, setSortElement] = useState('uploadDate')
    const [sortType, setSortType] = useState('desc');
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1);
    const [uploadDocModal, setUploadDocModal] = useState(false)
    const [uploadDocModalRequest, setUploadDocModalRequest] = useState(false)
    const [showDocument, setShowDocument] = useState(false)
    const [documentToShow, setDocumentToShow] = useState(null);
    const [columnsSaved, setColumnsSaved] = useState<any>([])
    let [searchObj, { setInitObj, textSearch, advanceSearch, resetHandler }] = AdvanceSearchHook()

    useEffect(() => {
        const paramsTemp = location.search.replace("?", "");
        const searchParams = JSON.parse('{"' + decodeURI(paramsTemp).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
        setParams(searchParams)
    }, [location])

    const {
        documents,
        totalCount,
        error,
        columns,
        loading,
        defaultColumns
    } = useSelector((state: any) => ({
        documents: state?.documentManager?.summary?.summaryDocumentsNot?.data,
        totalCount: state?.documentManager?.summary?.summaryDocumentsNot?.totalCount,
        error: state?.documentManager?.summary?.summaryDocumentsNot?.error,
        columns: state?.documentManager?.summary?.summaryDocumentsNot?.columns,
        loading: state?.documentManager?.summary?.summaryDocumentsNot?.loading,
        defaultColumns: state?.documentManager?.misc?.allTableColumns?.data
    }))

    useEffect(() => {
        setInitObj({
            pageSize: pageSize,
            pageNumber: pageNumber,
            textSearch: null,
            sortOrder: sortType,
            sortParam: sortElement
        })
        dispatch(MiscActionCreator.getColumnForAllTables('accounts'))
        return () => {
            dispatch(MyDocumentsActionCreator.resetDocumentList())
        }
    }, []);

    useEffect(() => {
        if (searchObj !== null) {
            search(pageSize, pageNumber)
        }
    }, [searchObj, sortElement, sortType])

    useEffect(() => {
        if (!loading && columns.length === 0 && (defaultColumns && defaultColumns.length > 0)) {
            setColumnsSaved(defaultColumns)
        } else {
            setColumnsSaved(columns)
        }
    }, [columns])

    const search = (
        pageSize: any,
        pageNumber: any
    ) => {
        searchObj = { ...searchObj, pageSize, pageNumber, sortParam: sortElement, sortOrder: sortType, ...params }
        dispatch(SummaryActionCreator.getSummaryDrillDownNot(searchObj))
        setShowAdvanceSearch(false)
    }

    /**
     * function is used in pagination
     * @param pageSize 
     * @param pageNumber 
    */
    const handlePagination = (pageSize: number, pageNumber: number) => {
        setPageSize(pageSize)
        search(pageSize, pageNumber)
    }

    return (<>
        <Col sm={12}>
            <Row>
                <AdvanceSearch
                    parentComponent={'documentNotSummary'}
                    Styles={Styles}
                    showAdvanceSearch={showAdvanceSearch}
                    setShowAdvanceSearch={(flag: any) => setShowAdvanceSearch(flag)}
                    textSearchHook={textSearch}
                    searchObj={searchObj}
                    advanceSearchHook={advanceSearch}
                    resetHandlerHook={resetHandler}
                />
                <Col md={2} sm={2}>
                    <Button variant="dark" style={{ width: "100%" }} onClick={() => setUploadDocModalRequest(true)}>Request {params.docTypeCode} for {params.inComplete} Accounts</Button>
                </Col>
                <Col md={2} sm={2}>
                    <Button variant="dark" style={{ width: "100%" }} onClick={() => setUploadDocModal(true)}>Upload {params.docTypeCode} for {params.inComplete} Accounts</Button>
                </Col>
            </Row>
            <br />
        </Col>
        <Col>
            <TableComponent
                data={documents}
                isLoading={loading}
                map={{
                    clientAccountNumber: "Client Account Number",
                    originalAccountNumber: "Original Account Number",
                    equabliAccountNumber: "Equabli Account Number",
                    fileName: "File Name",
                    generateDate: "Generation Date",
                    uploadDate: "Upload Date"
                }}
                totalCount={totalCount}
                actionArray={[]}
                handleNavigate={(data: any) => {
                    setShowDocument(true)
                    setDocumentToShow(data)
                }}
                currencyColumns={[]}
                sortElement={(header: any) => setSortElement(header)}
                sortType={(type: any) => setSortType(type)}
                currentPage={pageNumber}
                setCurrentPage={setPageNumber}
                parentComponent={'documentNotSummary'}
                searchCriteria={{}}
                hideShareArray={columnsSaved}
                addEditArray={
                    {
                        download: (data: any) => console.log(data),
                    }
                }
                handleDocumentManagerSummary={params}
                onPaginationChange={(
                    pageSize: number, pageNumber: number
                ) => handlePagination(pageSize, pageNumber)}
            ></TableComponent>
        </Col>
        {
            uploadDocModalRequest
            && <DocumentUpload
                show={uploadDocModalRequest}
                onHide={() => setUploadDocModalRequest(false)}
                accountId={123} Styles={Styles}
                parentComponent="documentNotSummary_request"
                search={search}
                details={{
                    ...params,
                    pageSize: totalCount
                }}
            />
        }
        {
            uploadDocModal
            && <DocumentUpload
                show={uploadDocModal}
                onHide={() => setUploadDocModal(false)}
                accountId={123} Styles={Styles}
                parentComponent="documentNotSummary"
                search={search}
                details={{
                    ...params,
                    pageSize: totalCount
                }}
            />
        }
        {
            showDocument &&
            <ViewDocument
                show={showDocument}
                onHide={() => setShowDocument(false)}
                documentData={documentToShow}
            />
        }
    </>)
}

export default SummaryDrillDownNotHave