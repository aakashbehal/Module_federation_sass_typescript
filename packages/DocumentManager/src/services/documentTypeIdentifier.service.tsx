import { axiosCustom, handleResponse } from "../helpers/util"
export interface IIdentifier {
    "docTypeCode": string,
    "docTypeFields": string[],
    "documentType": string
}
const getAllIdentifiers = async ({
    pageSize,
    pageNumber
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/identification/all`, {
            pageSize,
            pageNumber: pageNumber
        })
        const data = handleResponse(response)
        let identifiers = data.response.datas
        const responseModified: any = {}
        responseModified.identifiers = identifiers
        responseModified.totalCount = data.response.metadata.recordCount
        return responseModified
    } catch (error: any) {
        throw error.message
    }
}

const addDocumentCostIdentifier = async (requestBody: IIdentifier) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/identification`, requestBody)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const deleteDocumentCostIdentifier = async (docTypeCode: string) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/identification/${docTypeCode}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}


export const documentTypeIdentifierService = {
    getAllIdentifiers,
    addDocumentCostIdentifier,
    deleteDocumentCostIdentifier
}