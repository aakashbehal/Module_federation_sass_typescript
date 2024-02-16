const eventDispatcher = (type: string) => {

    let events: any = {
        'login': '/document_manager/my_documents',
        'logout': '/authentication/login'
    }

    window.dispatchEvent(new CustomEvent('collect', { detail: { type, url: events[type] } }))

}

export { eventDispatcher }