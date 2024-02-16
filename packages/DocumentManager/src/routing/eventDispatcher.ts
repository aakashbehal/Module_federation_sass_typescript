const eventDispatcher = (type: string) => {

    let events: any = {
        'logout': '/authentication/login'
    }

    window.dispatchEvent(new CustomEvent('DocumentManager', { detail: { type, url: events[type] } }))

}

export { eventDispatcher }