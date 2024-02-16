import { combineReducers } from "redux";

import miscReducer from "./common/misc.reducer";
import typesReducer from "./common/types.reducer";
import documentCostConfigurationReducer from "./documentCostConfiguration.reducer";
import downloadHistoryRequestReducer from "./downloadHistory.reducer";
import fileNameConfigReducer from "./fileNameConfig.reducer";
import myDocumentsReducer from "./myDocuments.reducer";
import receiveDocumentRequestReducer from "./receiveDocumentRequest.reducer";
import registrationReducer from "./registration.reducer";
import requiredDocumentsReducer from "./requiredDocuments.reducer";
import sentDocumentRequestReducer from "./sentDocumentRequest.reducer";
import shareReducer from "./share.reducer";
import summaryReducer from "./summary.reducer";
import userReducer from "./user.reducer";
import subscriptionReducer from "./subscription.reducer";
import usageReducer from "./usage.reducer";
import invoiceReducer from "./invoice.reducer";
import clientSetupReducer from "./clientSetup.reducer";
import partnerSetupReducer from "./partnerSetup.reducer";
import notificationReducer from "./notification.reducer";
import documentTypeIdentifierReducer from "./documentTypeIdentifier.reducer";
import domainReducer from "./domain.reducer";

export interface DocumentManagerRoot {
    documentManager: {
        misc: ReturnType<typeof miscReducer>,
        types: ReturnType<typeof typesReducer>,
        registration: ReturnType<typeof registrationReducer>,
        fileNameConfig: ReturnType<typeof fileNameConfigReducer>,
        myDocuments: ReturnType<typeof myDocumentsReducer>,
        cost: ReturnType<typeof documentCostConfigurationReducer>,
        requiredDocuments: ReturnType<typeof requiredDocumentsReducer>,
        sentDocumentRequest: ReturnType<typeof sentDocumentRequestReducer>,
        receiveDocumentRequest: ReturnType<typeof receiveDocumentRequestReducer>,
        downloadHistory: ReturnType<typeof downloadHistoryRequestReducer>,
        users: ReturnType<typeof userReducer>,
        summary: ReturnType<typeof summaryReducer>,
        share: ReturnType<typeof shareReducer>,
        subscription: ReturnType<typeof subscriptionReducer>,
        usage: ReturnType<typeof usageReducer>,
        invoice: ReturnType<typeof invoiceReducer>,
        clients: ReturnType<typeof clientSetupReducer>,
        partners: ReturnType<typeof partnerSetupReducer>,
        notification: ReturnType<typeof notificationReducer>,
        ocr: ReturnType<typeof documentTypeIdentifierReducer>,
        domain: ReturnType<typeof domainReducer>
    }
}

const appReducer = combineReducers({
    misc: miscReducer,
    types: typesReducer,
    registration: registrationReducer,
    fileNameConfig: fileNameConfigReducer,
    myDocuments: myDocumentsReducer,
    cost: documentCostConfigurationReducer,
    requiredDocuments: requiredDocumentsReducer,
    sentDocumentRequest: sentDocumentRequestReducer,
    receiveDocumentRequest: receiveDocumentRequestReducer,
    downloadHistory: downloadHistoryRequestReducer,
    users: userReducer,
    summary: summaryReducer,
    share: shareReducer,
    subscription: subscriptionReducer,
    usage: usageReducer,
    invoice: invoiceReducer,
    clients: clientSetupReducer,
    partners: partnerSetupReducer,
    notification: notificationReducer,
    ocr: documentTypeIdentifierReducer,
    domain: domainReducer
})

export default appReducer