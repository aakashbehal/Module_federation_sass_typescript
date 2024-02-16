import { MyDocumentsFolder, MyDocumentsList, DeleteDocument, DeleteFolder, DownloadFolder, DownloadDocument } from "../types.d"
import { myDocumentsService } from "../../services"

export const MyDocumentsActionCreator: any = {
    getMyDocumentFolders: (payload: any) => (dispatch: any) => {
        const request = () => ({ type: MyDocumentsFolder.MY_DOCUMENTS_FOLDER_REQUEST })
        const success = (user: any) => ({ type: MyDocumentsFolder.MY_DOCUMENTS_FOLDER_SUCCESS, payload: user })
        const failure = (error: any) => ({ type: MyDocumentsFolder.MY_DOCUMENTS_FOLDER_FAILURE, payload: error })

        dispatch(request())

        myDocumentsService.getMyDocumentFolders(payload)
            .then(
                user => {
                    dispatch(success(user))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getMyDocumentList: (payload: any) => (dispatch: any) => {
        const request = () => ({ type: MyDocumentsList.MY_DOCUMENTS_LIST_REQUEST })
        const success = (user: any) => ({ type: MyDocumentsList.MY_DOCUMENTS_LIST_SUCCESS, payload: user })
        const failure = (error: any) => ({ type: MyDocumentsList.MY_DOCUMENTS_LIST_FAILURE, payload: error })

        dispatch(request())

        myDocumentsService.getMyDocumentList(payload)
            .then(
                user => {
                    dispatch(success(user))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    resetDocumentList: () => (dispatch: any) => {
        dispatch(() => dispatch({ type: MyDocumentsList.MY_DOCUMENTS_LIST_RESET }))
    },
    deleteDocument: (documentId: any) => (dispatch: any) => {
        const request = () => ({ type: DeleteDocument.DELETE_DOCUMENTS_REQUEST })
        const success = (document: any) => ({ type: DeleteDocument.DELETE_DOCUMENTS_SUCCESS, payload: document })
        const failure = (error: any) => ({ type: DeleteDocument.DELETE_DOCUMENTS_FAILURE, payload: error })

        dispatch(request())

        myDocumentsService.deleteDocument(documentId)
            .then(
                document => {
                    dispatch(success(document))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(
                dispatch({ type: DeleteDocument.DELETE_DOCUMENTS_RESET })
            )
    },
    deleteFolder: (clientAccountNo: any) => (dispatch: any) => {
        const request = () => ({ type: DeleteFolder.DELETE_FOLDER_REQUEST })
        const success = (document: any) => ({ type: DeleteFolder.DELETE_FOLDER_SUCCESS, payload: document })
        const failure = (error: any) => ({ type: DeleteFolder.DELETE_FOLDER_FAILURE, payload: error })

        dispatch(request())

        myDocumentsService.deleteFolder(clientAccountNo)
            .then(
                document => {
                    dispatch(success(document))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(
                dispatch({ type: DeleteFolder.DELETE_FOLDER_RESET })
            )
    },
    downloadFolder: (accountNumbers: string[]) => (dispatch: any) => {
        const request = () => ({ type: DownloadFolder.DOWNLOAD_FOLDER_REQUEST })
        const success = (document: any) => ({ type: DownloadFolder.DOWNLOAD_FOLDER_SUCCESS, payload: document })
        const failure = (error: any) => ({ type: DownloadFolder.DOWNLOAD_FOLDER_FAILURE, payload: error })

        dispatch(request())

        myDocumentsService.downloadFolder(accountNumbers)
            .then(
                document => {
                    dispatch(success(document))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    restDownloadFolder: () => (dispatch: any) => {
        dispatch({ type: DownloadFolder.DOWNLOAD_FOLDER_RESET })
    },
    restDownloadDocument: () => (dispatch: any) => {
        dispatch({ type: DownloadDocument.DOWNLOAD_DOCUMENT_RESET })
    },
    downloadDocument: (documentIds: string[]) => (dispatch: any) => {
        const request = () => ({ type: DownloadDocument.DOWNLOAD_DOCUMENT_REQUEST })
        const success = (document: any) => ({ type: DownloadDocument.DOWNLOAD_DOCUMENT_SUCCESS, payload: document })
        const failure = (error: any) => ({ type: DownloadDocument.DOWNLOAD_DOCUMENT_FAILURE, payload: error })

        dispatch(request())

        myDocumentsService.downloadDocument(documentIds)
            .then(
                document => {
                    dispatch(success(document))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(
                dispatch({ type: DownloadDocument.DOWNLOAD_DOCUMENT_RESET })
            )
    }
}