import React from 'react';

const DocumentRemoteApp = ({ DocumentApp, store }: { DocumentApp: any, store: any }) => {
    return <>
        <DocumentApp store={store} />
    </>
}

export default DocumentRemoteApp