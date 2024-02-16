import { useState } from "react"

const AdvanceSearchHook = () => {
    const [state, setState] = useState<any>(null)

    const setInitObj = (searchObj: any) => {
        setState(searchObj)
    }

    const textSearch: any = async (text: any) => {
        setState((state: any) => {
            return { ...state, textSearch: text }
        })
    }

    const advanceSearch: any = async (searchParams: any) => {
        setState((state: any) => {
            return { ...state, ...searchParams, textSearch: null }
        })
    }

    const resetHandler: any = async () => {
        setState((state: any) => {
            return {
                pageSize: state.documentManager.pageSize,
                pageNumber: state.documentManager.pageNumber,
                textSearch: null,
                sortOrder: state.documentManager.sortOrder,
                sortParam: state.documentManager.sortParam
            }
        })
    }

    return [
        state,
        {
            setInitObj,
            textSearch,
            advanceSearch,
            resetHandler
        }
    ];
}

export default AdvanceSearchHook